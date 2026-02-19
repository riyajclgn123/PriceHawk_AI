# backend/ml/train.py
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
import joblib
import os

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineer features from price history for ML model.
    Creates time-based and rolling statistics features.
    """
    df = df.sort_values("scraped_at").copy()
    
    # Time-based features
    df["day_of_week"] = df["scraped_at"].dt.dayofweek
    df["day_of_month"] = df["scraped_at"].dt.day
    df["week_of_year"] = df["scraped_at"].dt.isocalendar().week.astype(int)
    df["month"] = df["scraped_at"].dt.month
    
    # Rolling statistics
    df["rolling_3d"] = df["price"].rolling(3, min_periods=1).mean()
    df["rolling_7d"] = df["price"].rolling(7, min_periods=1).mean()
    df["rolling_14d"] = df["price"].rolling(14, min_periods=1).mean()
    
    # Lag features
    df["price_lag_1"] = df["price"].shift(1).fillna(df["price"])
    df["price_lag_3"] = df["price"].shift(3).fillna(df["price"])
    df["price_lag_7"] = df["price"].shift(7).fillna(df["price"])
    
    # Price change features
    df["price_change"] = df["price"].diff().fillna(0)
    df["price_change_pct"] = df["price"].pct_change().fillna(0)
    
    # Volatility
    df["rolling_std"] = df["price"].rolling(7, min_periods=1).std().fillna(0)
    
    # Target: price 7 days from now
    df["target"] = df["price"].shift(-7)
    
    return df.dropna()


FEATURE_COLS = [
    "day_of_week", "day_of_month", "week_of_year", "month",
    "rolling_3d", "rolling_7d", "rolling_14d",
    "price_lag_1", "price_lag_3", "price_lag_7",
    "price_change", "price_change_pct", "rolling_std",
    "price"
]


def train_model(price_history: list[dict], save_path: str = "ml/model.pkl") -> dict:
    """
    Train and save the price prediction model.
    
    Args:
        price_history: List of dicts with 'price' and 'scraped_at' keys
        save_path: Where to save the trained model
        
    Returns:
        dict with training metrics
    """
    # Convert to DataFrame
    df = pd.DataFrame(price_history)
    df["scraped_at"] = pd.to_datetime(df["scraped_at"])
    
    # Build features
    df = build_features(df)
    
    if len(df) < 14:
        raise ValueError("Need at least 14 data points to train the model")
    
    X = df[FEATURE_COLS]
    y = df["target"]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("🚀 Training Gradient Boosting model...")
    model = GradientBoostingRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_preds = model.predict(X_train_scaled)
    test_preds = model.predict(X_test_scaled)
    
    train_mae = mean_absolute_error(y_train, train_preds)
    test_mae = mean_absolute_error(y_test, test_preds)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_preds))
    
    print(f"✅ Training MAE: ₹{train_mae:.2f}")
    print(f"✅ Test MAE: ₹{test_mae:.2f}")
    print(f"✅ Test RMSE: ₹{test_rmse:.2f}")
    
    # Save model and scaler
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump({
        "model": model,
        "scaler": scaler,
        "feature_cols": FEATURE_COLS
    }, save_path)
    print(f"💾 Model saved to {save_path}")
    
    return {
        "train_mae": float(train_mae),
        "test_mae": float(test_mae),
        "test_rmse": float(test_rmse),
        "n_samples": len(df),
        "n_features": len(FEATURE_COLS)
    }


# Example: Generate synthetic training data for testing
def generate_sample_data(n_days=60):
    """Generate sample price data for testing the model."""
    import random
    from datetime import datetime, timedelta
    
    base_price = 1000
    data = []
    current_date = datetime.now() - timedelta(days=n_days)
    
    for i in range(n_days):
        # Simulate price with trend and noise
        trend = -2 * (i / n_days)  # Slight downward trend
        noise = random.uniform(-50, 50)
        seasonal = 30 * np.sin(2 * np.pi * i / 7)  # Weekly pattern
        
        price = base_price + trend + noise + seasonal
        
        data.append({
            "price": round(price, 2),
            "scraped_at": current_date + timedelta(days=i)
        })
    
    return data


if __name__ == "__main__":
    print("🧪 Generating sample data for model training...")
    sample_data = generate_sample_data(n_days=60)
    
    print(f"📊 Training on {len(sample_data)} samples...")
    metrics = train_model(sample_data)
    
    print("\n" + "="*50)
    print("📈 Model Training Complete!")
    print("="*50)
    print(f"Train MAE: ₹{metrics['train_mae']:.2f}")
    print(f"Test MAE: ₹{metrics['test_mae']:.2f}")
    print(f"Test RMSE: ₹{metrics['test_rmse']:.2f}")
    print(f"Samples: {metrics['n_samples']}")
    print(f"Features: {metrics['n_features']}")
