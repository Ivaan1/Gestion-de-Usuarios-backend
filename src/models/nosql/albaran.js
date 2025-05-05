const mongoose = require('mongoose');

const albaranSchema = new mongoose.Schema({
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'client' 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'project' 
    },
    format: { 
        type: String, 
        enum: ['material', 'hours'], // El formato puede ser 'material' o 'hours'
        required: true 
    },
    material: { 
        type: String, 
        required: function() { return this.format === 'material'; }, // Solo requerido si el formato es material
        default: null
    },
    hours: { 
        type: Number, 
        required: function() { return this.format === 'hours'; }, // Solo requerido si el formato es hours
        default: null
    },
    description: { 
        type: String, 
        required: true 
    },
    workdate: { 
        type: Date, 
        required: false 
    },
    sign: { 
        type: String, 
        default: null // Ruta o archivo de la firma, opcional
    },
    pending: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true // Esto agrega automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('albaranes', albaranSchema);
