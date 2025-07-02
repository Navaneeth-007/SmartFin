from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# --- CONFIG ---
MONGO_URI = 'mongodb+srv://navaneeth007:navaneeth007@cluster0.yfkkdys.mongodb.net/'  # Change if using MongoDB Atlas
DB_NAME = 'smartfin'

# --- APP SETUP ---
app = Flask(__name__)
CORS(app)

# --- DB CONNECTION ---
def get_db():
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def serialize_txn(txn):
    txn['_id'] = str(txn['_id'])
    txn['user_id'] = str(txn['user_id'])
    return txn

# --- API ENDPOINTS ---

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    db = get_db()
    data = request.json
    # Validate required fields
    required = ['user_id', 'type', 'date', 'amount']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    # Convert date to datetime
    data['date'] = datetime.strptime(data['date'], '%Y-%m-%d')
    data['user_id'] = ObjectId(data['user_id'])
    db.transactions.insert_one(data)
    return jsonify({'status': 'success'})

@app.route('/api/transactions/<user_id>', methods=['GET'])
def get_transactions(user_id):
    db = get_db()
    txns = list(db.transactions.find({'user_id': ObjectId(user_id)}).sort('date', 1))
    return jsonify([serialize_txn(t) for t in txns])

@app.route('/api/suggestions/<user_id>', methods=['GET'])
def ai_suggestions(user_id):
    db = get_db()
    txns = list(db.transactions.find({'user_id': ObjectId(user_id)}).sort('date', 1))
    suggestions = get_suggestions(txns)
    return jsonify({'suggestions': suggestions})

# --- AI SUGGESTION LOGIC ---
def get_suggestions(transactions):
    expenses = [t for t in transactions if t['type'] == 'expense']
    incomes = [t for t in transactions if t['type'] == 'income']
    suggestions = []
    # Expense trend
    if len(expenses) > 1:
        if expenses[-1]['amount'] > expenses[-2]['amount']:
            suggestions.append('Your expenses are increasing. Consider reviewing your spending habits.')
        avg_expense = sum(e['amount'] for e in expenses) / len(expenses)
        if expenses[-1]['amount'] > avg_expense * 1.2:
            suggestions.append('Recent expense is much higher than your average. Watch out for budget overruns!')
    # Income trend
    if len(incomes) > 1:
        if incomes[-1]['amount'] < incomes[-2]['amount']:
            suggestions.append('Your income has reduced recently. Consider diversifying your income sources.')
    # Budget warning (simple): if last 3 expenses > 80% of last 3 incomes
    if len(expenses) >= 3 and len(incomes) >= 3:
        total_exp = sum(e['amount'] for e in expenses[-3:])
        total_inc = sum(i['amount'] for i in incomes[-3:])
        if total_exp > 0.8 * total_inc:
            suggestions.append('Your recent expenses are close to your income. You may exceed your budget this month.')
    if not suggestions:
        suggestions.append('Your finances look stable. Keep tracking your income and expenses!')
    return suggestions

# --- MAIN ---
if __name__ == '__main__':
    app.run(debug=True) 