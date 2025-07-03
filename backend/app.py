from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# --- CONFIG ---
MONGO_URI = 'mongodb+srv://navaneeth007:navaneeth007@cluster0.yfkkdys.mongodb.net/?tlsAllowInvalidCertificates=true'
DB_NAME = 'finance_db'
EXPENSES_COLLECTION = 'expenses'
INCOMES_COLLECTION = 'incomes'

# --- APP SETUP ---
app = Flask(__name__)

# --- CORS CONFIGURATION ---
CORS(
    app,
    origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# --- DB CONNECTION ---
def get_db():
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def serialize_expense(exp):
    exp['_id'] = str(exp['_id'])
    if isinstance(exp['date'], datetime):
        exp['date'] = exp['date'].strftime('%Y-%m-%d')
    return exp

def serialize_txn(txn):
    txn['_id'] = str(txn['_id'])
    txn['user_id'] = str(txn['user_id'])
    txn['date'] = txn['date'].strftime('%Y-%m-%d') if isinstance(txn['date'], datetime) else txn['date']
    return txn

# --- API ENDPOINTS ---

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    db = get_db()
    data = request.json
    required = ['uid', 'date', 'amount', 'description', 'category']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    expense = {
        'uid': data['uid'],
        'date': data['date'],
        'amount': float(data['amount']),
        'description': data['description'],
        'category': data['category']
    }
    db[EXPENSES_COLLECTION].insert_one(expense)
    return jsonify({'status': 'success'})

@app.route('/api/expenses/<uid>', methods=['GET'])
def get_expenses(uid):
    db = get_db()
    month = request.args.get('month')
    year = request.args.get('year')
    query = {'uid': uid}
    if month is not None and year is not None:
        month = int(month) + 1
        year = int(year)
        query['$expr'] = {
            '$and': [
                { '$eq': [{ '$month': { '$dateFromString': { 'dateString': '$date' } } }, month] },
                { '$eq': [{ '$year': { '$dateFromString': { 'dateString': '$date' } } }, year] }
            ]
        }
    expenses = list(db[EXPENSES_COLLECTION].find(query).sort('date', -1))
    return jsonify([serialize_expense(e) for e in expenses])


@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    db = get_db()
    result = db[EXPENSES_COLLECTION].delete_one({'_id': ObjectId(expense_id)})
    if result.deleted_count == 1:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'not found'}), 404

@app.route('/api/incomes', methods=['POST'])
def add_income():
    db = get_db()
    data = request.json
    required = ['uid', 'date', 'amount', 'source']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    income = {
        'uid': data['uid'],
        'date': data['date'],
        'amount': float(data['amount']),
        'source': data['source']
    }
    db[INCOMES_COLLECTION].insert_one(income)
    return jsonify({'status': 'success'})

@app.route('/api/incomes/<uid>', methods=['GET'])
def get_incomes(uid):
    db = get_db()
    month = request.args.get('month')
    year = request.args.get('year')
    query = {'uid': uid}
    if month is not None and year is not None:
        month = int(month) + 1
        year = int(year)
        query['$expr'] = {
            '$and': [
                { '$eq': [{ '$month': { '$dateFromString': { 'dateString': '$date' } } }, month] },
                { '$eq': [{ '$year': { '$dateFromString': { 'dateString': '$date' } } }, year] }
            ]
        }
    incomes = list(db[INCOMES_COLLECTION].find(query).sort('date', -1))
    for inc in incomes:
        inc['_id'] = str(inc['_id'])
    return jsonify(incomes)

@app.route('/api/incomes/<income_id>', methods=['DELETE'])
def delete_income(income_id):
    db = get_db()
    result = db[INCOMES_COLLECTION].delete_one({'_id': ObjectId(income_id)})
    if result.deleted_count == 1:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'not found'}), 404

# --- AI SUGGESTION LOGIC ---
def get_suggestions(transactions):
    expenses = [t for t in transactions if t['type'] == 'expense']
    incomes = [t for t in transactions if t['type'] == 'income']
    suggestions = []

    if len(expenses) > 1:
        if expenses[-1]['amount'] > expenses[-2]['amount']:
            suggestions.append('Your expenses are increasing. Consider reviewing your spending habits.')
        avg_expense = sum(e['amount'] for e in expenses) / len(expenses)
        if expenses[-1]['amount'] > avg_expense * 1.2:
            suggestions.append('Recent expense is much higher than your average. Watch out for budget overruns!')

    if len(incomes) > 1:
        if incomes[-1]['amount'] < incomes[-2]['amount']:
            suggestions.append('Your income has reduced recently. Consider diversifying your income sources.')

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