# backend/ml/predict.py
import joblib
import pandas as pd
import numpy as np
from typing import Dict, List
import os

def load_model(model_path: str = "ml/model.pkl"):
    """Load the trained model, scaler, and feature columns."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at {model_path}. "
            "Please train the model first using ml/train.py"
        )
    return joblib.load(model_path)


def build_features_for_prediction(df: pd.DataFrame, feature_cols: List[str]) -> pd.DataFrame:
    """
    Build the same features as training for prediction.
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
    
    return df[feature_cols]


def predict_price_drop(price_history: List[Dict]) -> Dict:
    """
    Given price history, predict if price will drop in 7 days.
    
    Args:
        price_history: List of dicts with 'price' and 'scraped_at' keys
        
    Returns:
        dict with prediction results
    """
    # Load model
    try:
        artifact = load_model()
        model = artifact["model"]
        scaler = artifact["scaler"]
        feature_cols = artifact["feature_cols"]
    except Exception as e:
        return {
            "error": f"Failed to load model: {str(e)}",
            "predicted_price": None,
            "will_drop": False,
            "confidence": "none"
        }
    
    # Convert to DataFrame
    df = pd.DataFrame(price_history)
    df["scraped_at"] = pd.to_datetime(df["scraped_at"])
    
    # Check if we have enough data
    if len(df) < 7:
        return {
            "error": "Need at least 7 days of history",
            "predicted_price": None,
            "will_drop": False,
            "confidence": "none",
            "current_count": len(df)
        }
    
    # Build features
    try:
        features_df = build_features_for_prediction(df, feature_cols)
    except Exception as e:
        return {
            "error": f"Feature engineering failed: {str(e)}",
            "predicted_price": None,
            "will_drop": False,
            "confidence": "none"
        }
    
    if features_df.empty:
        return {
            "error": "Not enough data after feature engineering",
            "predicted_price": None,
            "will_drop": False,
            "confidence": "none"
        }
    
    # Get latest features for prediction
    latest = features_df.iloc[[-1]]
    latest_scaled = scaler.transform(latest)
    
    # Predict
    predicted_price = float(model.predict(latest_scaled)[0])
    current_price = float(df["price"].iloc[-1])
    
    # Calculate drop percentage
    drop_amount = current_price - predicted_price
    drop_pct = (drop_amount / current_price) * 100
    
    # Determine confidence based on historical volatility
    price_std = df["price"].std()
    relative_change = abs(drop_amount) / price_std
    
    if relative_change > 1.5:
        confidence = "high"
    elif relative_change > 0.5:
        confidence = "medium"
    else:
        confidence = "low"
    
    return {
        "current_price": round(current_price, 2),
        "predicted_price": round(predicted_price, 2),
        "will_drop": predicted_price < current_price,
        "drop_amount": round(drop_amount, 2),
        "drop_percentage": round(drop_pct, 2),
        "confidence": confidence,
        "prediction_days": 7,
        "data_points_used": len(df)
    }


# Test the prediction
if __name__ == "__main__":
    from datetime import datetime, timedelta
    
    # Generate test data
    test_data = []
    base_date = datetime.now() - timedelta(days=30)
    for i in range(30):
        test_data.append({
            "price": 1000 + (i * -2) + np.random.uniform(-30, 30),
            "scraped_at": base_date + timedelta(days=i)
        })
    
    print("🔮 Testing price prediction...")
    result = predict_price_drop(test_data)
    
    print("\n" + "="*50)
    print("📊 Prediction Results")
    print("="*50)
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
    else:
        print(f"Current Price: ₹{result['current_price']}")
        print(f"Predicted Price (7 days): ₹{result['predicted_price']}")
        print(f"Will Drop: {'Yes ✅' if result['will_drop'] else 'No ❌'}")
        print(f"Change: ₹{result['drop_amount']} ({result['drop_percentage']}%)")
        print(f"Confidence: {result['confidence'].upper()}")
        print(f"Data Points: {result['data_points_used']}")
