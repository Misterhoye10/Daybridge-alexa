import os
import logging
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from app.config import Config
from app.models import db

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("daybridge")

def create_app(config_class=Config):
    template_dir = Config.BASE_DIR / "app" / "templates"
    app = Flask(__name__, template_folder=str(template_dir))
    app.config.from_object(config_class)

    # Enable CORS for React/Vite frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Determine database: test if PostgreSQL is accessible
    db_uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if "postgresql" in db_uri:
        try:
            import psycopg
            with psycopg.connect(db_uri, connect_timeout=2) as conn:
                pass
        except Exception as e:
            logger.warning(
                f"PostgreSQL connection to {db_uri.split('@')[-1] if '@' in db_uri else db_uri} failed: {e}\n"
                "==> Falling back to local SQLite ('backend/daybridge.db') so backend development continues smoothly without interruption."
            )
            app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{Config.BASE_DIR / 'daybridge.db'}"
    
    # Initialize DB with verified URI
    db.init_app(app)

    with app.app_context():
        db.create_all()
        logger.info(f"Database initialized: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[-1] if '@' in app.config['SQLALCHEMY_DATABASE_URI'] else 'sqlite'}")

    # Register API Blueprints
    from app.routes.plans import plans_bp
    from app.routes.tasks import tasks_bp
    from app.routes.chat import chat_bp

    app.register_blueprint(plans_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(chat_bp)

    @app.route("/", methods=["GET"])
    @app.route("/demo", methods=["GET"])
    def index():
        # If client accepts HTML, serve the interactive testing playground
        if "text/html" in request.headers.get("Accept", ""):
            return render_template("demo.html")
        return jsonify({
            "service": "Daybridge API (Alexa+ Hackathon 2026)",
            "status": "active",
            "tagline": "Say it. Plan it. Get it done.",
            "demo_ui": "/demo",
            "endpoints": [
                "/api/health",
                "/api/chat (POST)",
                "/api/plans (GET, POST)",
                "/api/plans/:id (GET, PATCH, DELETE)",
                "/api/tasks/:id (PATCH, DELETE)"
            ]
        }), 200

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "Daybridge Backend",
            "version": "1.0.0"
        }), 200

    return app
