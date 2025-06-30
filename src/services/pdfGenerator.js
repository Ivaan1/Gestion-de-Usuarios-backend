const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF de albarán y lo escribe directamente en el response stream
 * @param {Object} albaran - Objeto de albarán con datos populados
 * @param {Object} outputStream - Stream donde se escribirá el PDF (puede ser res o fs.createWriteStream)
 * @returns {Promise<void>}
 */
const generateAlbaranPDF = async (albaran, outputStream) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear un nuevo documento PDF
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });
      
      // Pipe el PDF al stream de salida
      doc.pipe(outputStream);
      
      // Configurar estilos
      const titleFont = 'Helvetica-Bold';
      const normalFont = 'Helvetica';
      const textColor = '#333333';
      
      // Encabezado
      doc.font(titleFont)
         .fontSize(18)
         .fillColor(textColor)
         .text('ALBARÁN DE ENTREGA', { align: 'center' });
      
      doc.moveDown();
      
      // Número de albarán destacado
      doc.font(titleFont)
         .fontSize(14)
         .text(`Albarán: ${albaran.albaranCode || albaran._id}`, { align: 'center' });
      
      doc.moveDown();
      
      // Información de la empresa
      doc.font(titleFont)
         .fontSize(12)
         .text('DATOS DE LA EMPRESA:');
      
      // Usar datos del usuario (empresa emisora)
      doc.font(normalFont)
         .fontSize(10)
         .text(`Empresa: Tu Empresa S.L.`)
         .text(`Email: ${albaran.userId.email}`)
  
      doc.moveDown();
      
      // Información del cliente
      doc.font(titleFont)
         .fontSize(12)
         .text('CLIENTE:');
      
      doc.font(normalFont)
         .fontSize(10)
         .text(`Nombre: ${albaran.clientId.name}`)
         .text(`CIF: ${albaran.clientId.cif}`)
         .text(`Dirección: ${albaran.clientId.address.street} ${albaran.clientId.address.number}, ${albaran.clientId.address.postal} ${albaran.clientId.address.city}, ${albaran.clientId.address.province}`);
      
      doc.moveDown();
      
      // Información del albarán
      doc.font(titleFont)
         .fontSize(12)
         .text('DETALLES DEL ALBARÁN:');
      
      doc.font(normalFont)
         .fontSize(10)
         .text(`Fecha: ${new Date(albaran.workdate || albaran.createdAt).toLocaleDateString('es-ES')}`)
         .text(`Proyecto: ${albaran.projectId ? albaran.projectId.name : 'N/A'} ${albaran.projectId ? '(' + albaran.projectId.projectCode + ')' : ''}`)
         .text(`Descripción: ${albaran.description || 'Sin descripción'}`);
      
      doc.moveDown();
      
      // Tabla de productos/servicios según el formato
      const tableTop = doc.y;
      let tableHeaders = [];
      let tableColumnWidths = [];
      
      if (albaran.format === 'materials') {
        tableHeaders = ['Material', 'Observaciones'];
        tableColumnWidths = [300, 190];
      } else if (albaran.format === 'items') {
        tableHeaders = ['Descripción', 'Cantidad', 'Unidad', 'Observaciones'];
        tableColumnWidths = [240, 70, 70, 110];
      } else {
        tableHeaders = ['Descripción', 'Horas', 'Observaciones'];
        tableColumnWidths = [240, 70, 180];
      }
      
      // Dibujar encabezados de tabla
      let currentX = doc.x;
      let currentY = doc.y;
      
      doc.font(titleFont)
         .fontSize(10);
      
      // Dibujar fondo del encabezado
      doc.rect(currentX, currentY, 490, 20)
         .fillAndStroke('#e9e9e9', '#cccccc');
      
      // Dibujar textos del encabezado
      tableHeaders.forEach((header, i) => {
        doc.text(
          header,
          currentX + 5,
          currentY + 5,
          { width: tableColumnWidths[i], align: 'left' }
        );
        currentX += tableColumnWidths[i];
      });
      
      // Restaurar posición y configuración para filas de datos
      currentX = doc.x;
      currentY += 20;
      doc.font(normalFont);
      
      // Dibujar filas según el formato del albarán
      let rowHeight = 0;
      
      if (albaran.format === 'materials' && albaran.materials && albaran.materials.length > 0) {
        // Mostrar lista de materiales
        albaran.materials.forEach((material, index) => {
          rowHeight = Math.max(
            doc.heightOfString(material, { width: tableColumnWidths[0] - 10 }),
            25
          );
          
          // Verificar si necesitamos una nueva página
          if (currentY + rowHeight > doc.page.height - 100) {
            doc.addPage();
            currentY = doc.page.margins.top;
            // Redibuja los encabezados en la nueva página
            doc.font(titleFont).fontSize(10);
            currentX = doc.x;
            
            doc.rect(currentX, currentY, 490, 20)
               .fillAndStroke('#e9e9e9', '#cccccc');
            
            tableHeaders.forEach((header, i) => {
              doc.text(
                header,
                currentX + 5,
                currentY + 5,
                { width: tableColumnWidths[i], align: 'left' }
              );
              currentX += tableColumnWidths[i];
            });
            
            currentX = doc.x;
            currentY += 20;
            doc.font(normalFont);
          }
          
          // Dibujar la fila
          doc.rect(currentX, currentY, 490, rowHeight)
             .stroke('#cccccc');
          
          // Dibujar separador de columnas
          doc.moveTo(currentX + tableColumnWidths[0], currentY)
             .lineTo(currentX + tableColumnWidths[0], currentY + rowHeight)
             .stroke('#cccccc');
          
          // Material
          doc.text(
            material,
            currentX + 5,
            currentY + 5,
            { width: tableColumnWidths[0] - 10, align: 'left' }
          );
          
          // No hay observaciones específicas para materiales, dejamos en blanco
          
          // Actualizar posición Y para la siguiente fila
          currentY += rowHeight;
        });
      } else if (albaran.format === 'hours' && albaran.hours && albaran.hours.length > 0) {
        // Mostrar lista de horas trabajadas
        albaran.hours.forEach((hour, index) => {
          const description = hour.description || '';
          const hoursValue = hour.hours ? `${hour.hours}h` : '';
          const observations = hour.observations || '';
          
          rowHeight = Math.max(
            doc.heightOfString(description, { width: tableColumnWidths[0] - 10 }),
            doc.heightOfString(observations, { width: tableColumnWidths[2] - 10 }),
            25
          );
          
          // Verificar si necesitamos una nueva página
          if (currentY + rowHeight > doc.page.height - 100) {
            doc.addPage();
            currentY = doc.page.margins.top;
            // Redibuja los encabezados en la nueva página
            doc.font(titleFont).fontSize(10);
            currentX = doc.x;
            
            doc.rect(currentX, currentY, 490, 20)
               .fillAndStroke('#e9e9e9', '#cccccc');
            
            tableHeaders.forEach((header, i) => {
              doc.text(
                header,
                currentX + 5,
                currentY + 5,
                { width: tableColumnWidths[i], align: 'left' }
              );
              currentX += tableColumnWidths[i];
            });
            
            currentX = doc.x;
            currentY += 20;
            doc.font(normalFont);
          }
          
          // Dibujar la fila
          doc.rect(currentX, currentY, 490, rowHeight)
             .stroke('#cccccc');
          
          // Dibujar separadores de columnas
          let colX = currentX;
          tableColumnWidths.forEach((width, i) => {
            if (i > 0) {
              doc.moveTo(colX, currentY)
                 .lineTo(colX, currentY + rowHeight)
                 .stroke('#cccccc');
            }
            colX += width;
          });
          
          // Rellenar contenido
          colX = currentX;
          
          // Descripción
          doc.text(
            description,
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[0] - 10, align: 'left' }
          );
          colX += tableColumnWidths[0];
          
          // Horas
          doc.text(
            hoursValue,
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[1] - 10, align: 'center' }
          );
          colX += tableColumnWidths[1];
          
          // Observaciones
          doc.text(
            observations,
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[2] - 10, align: 'left' }
          );
          
          // Actualizar posición Y para la siguiente fila
          currentY += rowHeight;
        });
      } else if (albaran.format === 'items' && albaran.items && albaran.items.length > 0) {
        // Mostrar lista de items (como en el código original)
        albaran.items.forEach((item, index) => {
          // Calcular altura de la fila basada en el contenido más largo
          const descriptionHeight = doc.heightOfString(item.description, { 
            width: tableColumnWidths[0] - 10,
            align: 'left'
          });
          
          const observationsHeight = doc.heightOfString(item.observations || '', { 
            width: tableColumnWidths[3] - 10,
            align: 'left'
          });
          
          rowHeight = Math.max(descriptionHeight, observationsHeight, 25);
          
          // Verificar si necesitamos una nueva página
          if (currentY + rowHeight > doc.page.height - 100) {
            doc.addPage();
            currentY = doc.page.margins.top;
            // Redibuja los encabezados en la nueva página
            doc.font(titleFont)
               .fontSize(10);
            currentX = doc.x;
            
            doc.rect(currentX, currentY, 490, 20)
               .fillAndStroke('#e9e9e9', '#cccccc');
            
            tableHeaders.forEach((header, i) => {
              doc.text(
                header,
                currentX + 5,
                currentY + 5,
                { width: tableColumnWidths[i], align: 'left' }
              );
              currentX += tableColumnWidths[i];
            });
            
            currentX = doc.x;
            currentY += 20;
            doc.font(normalFont);
          }
          
          // Dibujar bordes de la celda
          doc.rect(currentX, currentY, 490, rowHeight)
             .stroke('#cccccc');
          
          // Dibujar separadores de columnas
          let colX = currentX;
          tableColumnWidths.forEach((width, i) => {
            if (i > 0) {
              doc.moveTo(colX, currentY)
                 .lineTo(colX, currentY + rowHeight)
                 .stroke('#cccccc');
            }
            colX += width;
          });
          
          // Dibujar contenido de las celdas
          colX = currentX;
          
          // Descripción
          doc.text(
            item.description,
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[0] - 10, align: 'left' }
          );
          colX += tableColumnWidths[0];
          
          // Cantidad
          doc.text(
            item.quantity.toString(),
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[1] - 10, align: 'right' }
          );
          colX += tableColumnWidths[1];
          
          // Unidad
          doc.text(
            item.unit || 'Ud.',
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[2] - 10, align: 'center' }
          );
          colX += tableColumnWidths[2];
          
          // Observaciones
          doc.text(
            item.observations || '',
            colX + 5,
            currentY + 5,
            { width: tableColumnWidths[3] - 10, align: 'left' }
          );
          
          // Actualizar posición Y para la siguiente fila
          currentY += rowHeight;
        });
      } else {
        // Si no hay productos, mostrar un mensaje
        doc.text('No hay elementos en este albarán', currentX + 5, currentY + 10);
        currentY += 30;
      }
      
      // Observaciones generales del albarán
      doc.moveDown(2);
      doc.font(titleFont)
         .text('OBSERVACIONES:');
      
      doc.font(normalFont)
         .text(albaran.observations || 'Sin observaciones.');
      
      // Estado del albarán
      doc.moveDown();
      doc.font(titleFont)
         .text('ESTADO:');
      
      doc.font(normalFont)
         .text(albaran.pending ? 'PENDIENTE' : 'COMPLETADO');
      
      // Firmas
      doc.moveDown(2);
      
      // Calcular si queda suficiente espacio para las firmas
      if (doc.y > doc.page.height - 150) {
        doc.addPage();
      }
      
      const signatureY = doc.y;
      
      // Firma empresa
      doc.font(titleFont)
         .text('Firma y sello empresa:', doc.x, signatureY);
      
      doc.rect(doc.x, signatureY + 20, 200, 60)
         .stroke();
      
      // Firma cliente
      doc.font(titleFont)
         .text('Firma y sello cliente:', doc.x + 250, signatureY);
      
      // Si hay firma del cliente, mostrarla
      if (albaran.sign) {
        try {
          // Si es una URL de imagen
          doc.image(albaran.sign, doc.x + 250, signatureY + 20, { 
            fit: [200, 60],
            align: 'center',
            valign: 'center'
          });
        } catch (e) {
          // Si hay error al cargar la imagen, solo dibujar el recuadro
          console.log('No se pudo cargar la imagen de firma');
          doc.rect(doc.x + 250, signatureY + 20, 200, 60)
             .stroke();
        }
      } else {
        // Si no hay firma, solo dibujar el recuadro
        doc.rect(doc.x + 250, signatureY + 20, 200, 60)
           .stroke();
      }
      
      // Si el albarán está firmado, indicarlo
      if (albaran.signed) {
        doc.font(normalFont)
           .fontSize(8)
           .text('ALBARÁN FIRMADO', doc.x + 250, signatureY + 85);
      }
      
      // Pie de página
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Añadir pie de página
        doc.font(normalFont)
           .fontSize(8)
           .text(
             `Página ${i + 1} de ${pageCount} - Albarán: ${albaran.albaranCode || albaran._id} - Fecha: ${new Date().toLocaleDateString('es-ES')}`,
             50,
             doc.page.height - 50,
             { align: 'center', width: doc.page.width - 100 }
           );
      }
      
      // Finalizar el documento
      doc.end();
      
      // Cuando el documento termine de escribirse, resolver la promesa
      outputStream.on('finish', () => {
        resolve();
      });
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      reject(error);
    }
  });
};

/**
 * Guarda un PDF de albarán en el sistema de archivos
 * @param {Object} albaran - Objeto de albarán con datos populados
 * @returns {Promise<string>} - Ruta donde se guardó el PDF
 */
const saveAlbaranPDF = async (albaran) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear directorio si no existe
      const uploadsDir = path.join(__dirname, '../uploads/albaranes');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = albaran.albaranCode ? 
        `albaran-${albaran.albaranCode.replace(/\//g, '-')}.pdf` : 
        `albaran-${albaran._id}.pdf`;
      
      const pdfPath = path.join(uploadsDir, fileName);
      const fileStream = fs.createWriteStream(pdfPath);
      
      // Generar el PDF y escribirlo en el archivo
      generateAlbaranPDF(albaran, fileStream)
        .then(() => {
          resolve(pdfPath);
        })
        .catch((error) => {
          reject(error);
        });
        
    } catch (error) {
      console.error('Error al guardar el PDF:', error);
      reject(error);
    }
  });
};

module.exports = {
  generateAlbaranPDF,
  saveAlbaranPDF
};