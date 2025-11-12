"""
Main Flask application for personal accounting system.
"""
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from models import db, Gasto, Despesa
from datetime import datetime
from sqlalchemy import extract, func
import os
import logging

app = Flask(__name__)
CORS(app)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "accounting.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Categories
CATEGORIAS = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Entretenimento',
    'Outros'
]


@app.route('/')
def index():
    """Render main page."""
    return render_template('index.html', categorias=CATEGORIAS)


# ==================== GASTOS ENDPOINTS ====================

@app.route('/api/gastos', methods=['GET'])
def get_gastos():
    """Get all gastos with optional filters."""
    try:
        query = Gasto.query
        
        # Filter by date range
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        categoria = request.args.get('categoria')
        
        if data_inicio:
            query = query.filter(Gasto.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        if data_fim:
            query = query.filter(Gasto.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        if categoria:
            query = query.filter(Gasto.categoria == categoria)
        
        gastos = query.order_by(Gasto.data.desc()).all()
        return jsonify([gasto.to_dict() for gasto in gastos])
    except Exception as e:
        logger.error(f"Error getting gastos: {str(e)}")
        return jsonify({'error': 'Failed to retrieve gastos'}), 400


@app.route('/api/gastos', methods=['POST'])
def create_gasto():
    """Create a new gasto."""
    try:
        data = request.get_json()
        
        # Validation
        if not all(key in data for key in ['data', 'categoria', 'descricao', 'valor']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if float(data['valor']) <= 0:
            return jsonify({'error': 'Valor must be positive'}), 400
        
        gasto = Gasto(
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            categoria=data['categoria'],
            descricao=data['descricao'],
            valor=float(data['valor'])
        )
        
        db.session.add(gasto)
        db.session.commit()
        
        return jsonify(gasto.to_dict()), 201
    except ValueError as e:
        logger.error(f"Validation error creating gasto: {str(e)}")
        return jsonify({'error': 'Invalid data provided'}), 400
    except Exception as e:
        logger.error(f"Error creating gasto: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create gasto'}), 400


@app.route('/api/gastos/<int:id>', methods=['PUT'])
def update_gasto(id):
    """Update an existing gasto."""
    try:
        gasto = Gasto.query.get_or_404(id)
        data = request.get_json()
        
        if 'data' in data:
            gasto.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
        if 'categoria' in data:
            gasto.categoria = data['categoria']
        if 'descricao' in data:
            gasto.descricao = data['descricao']
        if 'valor' in data:
            if float(data['valor']) <= 0:
                return jsonify({'error': 'Valor must be positive'}), 400
            gasto.valor = float(data['valor'])
        
        db.session.commit()
        return jsonify(gasto.to_dict())
    except ValueError as e:
        logger.error(f"Validation error updating gasto {id}: {str(e)}")
        return jsonify({'error': 'Invalid data provided'}), 400
    except Exception as e:
        logger.error(f"Error updating gasto {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update gasto'}), 400


@app.route('/api/gastos/<int:id>', methods=['DELETE'])
def delete_gasto(id):
    """Delete a gasto."""
    try:
        gasto = Gasto.query.get_or_404(id)
        db.session.delete(gasto)
        db.session.commit()
        return jsonify({'message': 'Gasto deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting gasto {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete gasto'}), 400


# ==================== DESPESAS ENDPOINTS ====================

@app.route('/api/despesas', methods=['GET'])
def get_despesas():
    """Get all despesas with optional filters."""
    try:
        query = Despesa.query
        
        # Filter by date range
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        categoria = request.args.get('categoria')
        
        if data_inicio:
            query = query.filter(Despesa.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        if data_fim:
            query = query.filter(Despesa.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        if categoria:
            query = query.filter(Despesa.categoria == categoria)
        
        despesas = query.order_by(Despesa.data.desc()).all()
        return jsonify([despesa.to_dict() for despesa in despesas])
    except Exception as e:
        logger.error(f"Error getting despesas: {str(e)}")
        return jsonify({'error': 'Failed to retrieve despesas'}), 400


@app.route('/api/despesas', methods=['POST'])
def create_despesa():
    """Create a new despesa."""
    try:
        data = request.get_json()
        
        # Validation
        if not all(key in data for key in ['data', 'categoria', 'descricao', 'valor']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if float(data['valor']) <= 0:
            return jsonify({'error': 'Valor must be positive'}), 400
        
        despesa = Despesa(
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            categoria=data['categoria'],
            descricao=data['descricao'],
            valor=float(data['valor'])
        )
        
        db.session.add(despesa)
        db.session.commit()
        
        return jsonify(despesa.to_dict()), 201
    except ValueError as e:
        logger.error(f"Validation error creating despesa: {str(e)}")
        return jsonify({'error': 'Invalid data provided'}), 400
    except Exception as e:
        logger.error(f"Error creating despesa: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create despesa'}), 400


@app.route('/api/despesas/<int:id>', methods=['PUT'])
def update_despesa(id):
    """Update an existing despesa."""
    try:
        despesa = Despesa.query.get_or_404(id)
        data = request.get_json()
        
        if 'data' in data:
            despesa.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
        if 'categoria' in data:
            despesa.categoria = data['categoria']
        if 'descricao' in data:
            despesa.descricao = data['descricao']
        if 'valor' in data:
            if float(data['valor']) <= 0:
                return jsonify({'error': 'Valor must be positive'}), 400
            despesa.valor = float(data['valor'])
        
        db.session.commit()
        return jsonify(despesa.to_dict())
    except ValueError as e:
        logger.error(f"Validation error updating despesa {id}: {str(e)}")
        return jsonify({'error': 'Invalid data provided'}), 400
    except Exception as e:
        logger.error(f"Error updating despesa {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update despesa'}), 400


@app.route('/api/despesas/<int:id>', methods=['DELETE'])
def delete_despesa(id):
    """Delete a despesa."""
    try:
        despesa = Despesa.query.get_or_404(id)
        db.session.delete(despesa)
        db.session.commit()
        return jsonify({'message': 'Despesa deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting despesa {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete despesa'}), 400


# ==================== REPORTS ENDPOINTS ====================

@app.route('/api/relatorios/resumo', methods=['GET'])
def get_resumo():
    """Get financial summary."""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        gastos_query = db.session.query(func.sum(Gasto.valor))
        despesas_query = db.session.query(func.sum(Despesa.valor))
        
        if data_inicio:
            data_inicio_obj = datetime.strptime(data_inicio, '%Y-%m-%d').date()
            gastos_query = gastos_query.filter(Gasto.data >= data_inicio_obj)
            despesas_query = despesas_query.filter(Despesa.data >= data_inicio_obj)
        
        if data_fim:
            data_fim_obj = datetime.strptime(data_fim, '%Y-%m-%d').date()
            gastos_query = gastos_query.filter(Gasto.data <= data_fim_obj)
            despesas_query = despesas_query.filter(Despesa.data <= data_fim_obj)
        
        total_gastos = gastos_query.scalar() or 0
        total_despesas = despesas_query.scalar() or 0
        
        saldo = total_gastos - total_despesas
        
        return jsonify({
            'total_gastos': float(total_gastos),
            'total_despesas': float(total_despesas),
            'saldo': float(saldo)
        })
    except Exception as e:
        logger.error(f"Error getting resumo: {str(e)}")
        return jsonify({'error': 'Failed to generate summary'}), 400


@app.route('/api/relatorios/gastos-por-categoria', methods=['GET'])
def get_gastos_por_categoria():
    """Get gastos grouped by category."""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = db.session.query(
            Gasto.categoria,
            func.sum(Gasto.valor).label('total')
        )
        
        if data_inicio:
            query = query.filter(Gasto.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        if data_fim:
            query = query.filter(Gasto.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        
        results = query.group_by(Gasto.categoria).all()
        
        return jsonify([{
            'categoria': categoria,
            'total': float(total)
        } for categoria, total in results])
    except Exception as e:
        logger.error(f"Error getting gastos by category: {str(e)}")
        return jsonify({'error': 'Failed to generate report'}), 400


@app.route('/api/relatorios/despesas-por-categoria', methods=['GET'])
def get_despesas_por_categoria():
    """Get despesas grouped by category."""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = db.session.query(
            Despesa.categoria,
            func.sum(Despesa.valor).label('total')
        )
        
        if data_inicio:
            query = query.filter(Despesa.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        if data_fim:
            query = query.filter(Despesa.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        
        results = query.group_by(Despesa.categoria).all()
        
        return jsonify([{
            'categoria': categoria,
            'total': float(total)
        } for categoria, total in results])
    except Exception as e:
        logger.error(f"Error getting despesas by category: {str(e)}")
        return jsonify({'error': 'Failed to generate report'}), 400


@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    """Get list of available categories."""
    return jsonify(CATEGORIAS)


if __name__ == '__main__':
    import os
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
