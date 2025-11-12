"""
Database models for the personal accounting application.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Gasto(db.Model):
    """Model for tracking gastos (expenses/spending)."""
    __tablename__ = 'gastos'
    
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    categoria = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            'id': self.id,
            'data': self.data.strftime('%Y-%m-%d'),
            'categoria': self.categoria,
            'descricao': self.descricao,
            'valor': self.valor,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }


class Despesa(db.Model):
    """Model for tracking despesas (debts/bills)."""
    __tablename__ = 'despesas'
    
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    categoria = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            'id': self.id,
            'data': self.data.strftime('%Y-%m-%d'),
            'categoria': self.categoria,
            'descricao': self.descricao,
            'valor': self.valor,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
