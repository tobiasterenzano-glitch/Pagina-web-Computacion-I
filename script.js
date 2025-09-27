
    document.addEventListener("DOMContentLoaded", () => {
      const productos = [
  { nombre: 'Monitor Xiaomi 24" A24i Fhd 100hz Con Panel Ips', precio: 180000 },
  { nombre: 'Monitor Led 24 Viewsonic Va240-h 100hz 1ms Full Hd Hdmi Color Negro', precio: 178000 },
  { nombre: 'Samsung Monitor 49 Odyssey G9 G91f Dqhd 144hz Gaming', precio: 2280000 },
  { nombre: 'Monitor Gamer 27" Samsung Odyssey G6 G60SD OLED QHD 360Hz LS27DG600SLX', precio: 1806000 },
  { nombre: 'Monitor Gamer Samsung Odyssey G3 S32AG32 32 " Color Negro', precio: 460000 }
      ];

      // Renderizar filas del formulario
      const productosTbody = document.getElementById("productos-tbody");
      const filas = [];
      for (let i = 0; i < 5; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><input type="number" min="0" value="0" class="cantidad-input" style="width:50px;"></td>
          <td>
            <div class="select-producto">
              <button type="button" class="select-btn" data-idx="${i}" style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid #bfc1c2;background:#fafafa;color:#232323;">Seleccionar Producto</button>
              <div class="select-list" id="select-list-${i}"></div>
            </div>
          </td>
            <td><span class="precio-unitario-text" style="display:inline-block;width:90px;">-</span></td>
          <td><span class="precio-total">0</span></td>
        `;
        productosTbody.appendChild(tr);
        filas.push(tr);
      }

      // Renderizar lista de productos con imágenes en el select
      function renderSelectList(idx) {
        const list = document.getElementById(`select-list-${idx}`);
        list.innerHTML = productos.map((p, i) => `
          <div class="select-item" data-prod="${i}">
            <span>${p.nombre}</span>
          </div>
        `).join('');
        list.classList.add("active");
      }

      // Manejo de selección de producto
      productosTbody.addEventListener("click", function(e) {
        if (e.target.classList.contains("select-btn")) {
          const idx = e.target.getAttribute("data-idx");
          // Cerrar otros select-list activos
          document.querySelectorAll('.select-list.active').forEach(list => list.classList.remove('active'));
          renderSelectList(idx);
          // Evitar que el click se propague y cierre el select inmediatamente
          e.stopPropagation();
        }
        const selectItem = e.target.closest(".select-item");
        if (selectItem) {
          const prodIdx = selectItem.getAttribute("data-prod");
          const parent = selectItem.closest(".select-producto");
          const btn = parent.querySelector(".select-btn");
          btn.textContent = productos[prodIdx].nombre;
          btn.setAttribute("data-prod", prodIdx);
          parent.querySelector(".select-list").classList.remove("active");
          // Autocompletar precio unitario
          const tr = parent.closest("tr");
            tr.querySelector(".precio-unitario-text").textContent = productos[prodIdx].precio.toLocaleString("es-AR");
          // Calcular precio total
          const cantidad = parseInt(tr.querySelector(".cantidad-input").value) || 0;
          tr.querySelector(".precio-total").textContent = (cantidad * productos[prodIdx].precio).toLocaleString("es-AR");
          e.stopPropagation();
        }
      });

      // Cerrar select si se hace click fuera
      document.addEventListener("click", function(e) {
        if (!e.target.classList.contains("select-btn") && !e.target.classList.contains("select-item")) {
          document.querySelectorAll(".select-list.active").forEach(list => list.classList.remove("active"));
        }
      });

      // Calcular precio total al cambiar cantidad o precio unitario
      productosTbody.addEventListener("input", function(e) {
        if (e.target.classList.contains("cantidad-input") || e.target.classList.contains("precio-unitario-input")) {
          const tr = e.target.closest("tr");
          const cantidad = parseInt(tr.querySelector(".cantidad-input").value) || 0;
            const precioUnitario = parseFloat(tr.querySelector(".precio-unitario-text").textContent.replace(/[^\d,\.]/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
          tr.querySelector(".precio-total").textContent = (cantidad * precioUnitario).toLocaleString("es-AR");
        }
      });

      // Calcular y mostrar resumen al presionar Calcular Total
      document.getElementById("calcular-btn").addEventListener("click", function() {
        const nombre = document.getElementById("nombre").value.trim();
        const productosSeleccionados = [];
        filas.forEach(tr => {
          const cantidad = parseInt(tr.querySelector(".cantidad-input").value) || 0;
          const btn = tr.querySelector(".select-btn");
          const prodIdx = btn.getAttribute("data-prod");
      // const precioUnitario = parseFloat(tr.querySelector(".precio-unitario-input").value) || 0;
        const precioUnitario = parseFloat(tr.querySelector(".precio-unitario-text").textContent.replace(/[^\d,\.]/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
          if (cantidad > 0 && prodIdx !== null) {
            productosSeleccionados.push({
              nombre: productos[prodIdx].nombre,
              cantidad,
              precio: precioUnitario
            });
          }
        });
        if (!nombre) {
          alert("Por favor ingresa el nombre del cliente.");
          return;
        }
        if (productosSeleccionados.length === 0) {
          alert("Selecciona al menos un producto y cantidad.");
          return;
        }
        // Calcular total
        const subtotal = productosSeleccionados.reduce((acc, p) => acc + (p.cantidad * p.precio), 0);
        const iva = subtotal * 0.21;
        const total = subtotal + iva;
        const ahora12 = total / 12;
        const ahora18 = total * 1.35 / 18;
        // Mostrar resultado
        const resumen = document.getElementById("resumen");
        resumen.innerHTML = `
          <p><strong>Cliente:</strong> ${nombre}</p>
          <ul>
            ${productosSeleccionados.map(p => `
              <li>${p.nombre} - ${p.cantidad} x $${p.precio.toLocaleString("es-AR")} = $${(p.cantidad * p.precio).toLocaleString("es-AR")}</li>
            `).join('')}
          </ul>
          <div style="display:flex;justify-content:space-between;gap:24px;">
            <div>
              <p><strong>Valor de Cuota Ahora 12:</strong> $${ahora12.toLocaleString("es-AR")} (Sin Interés)</p>
              <p><strong>Valor Ahora 18:</strong> $${ahora18.toLocaleString("es-AR")} (35% de Interés)</p>
            </div>
            <div>
              <p><strong>Subtotal:</strong> $${subtotal.toLocaleString("es-AR")}</p>
              <p><strong>IVA:</strong> $${iva.toLocaleString("es-AR")}</p>
              <p><strong>Total:</strong> $${total.toLocaleString("es-AR")}</p>
            </div>
          </div>
        `;
        document.getElementById("resultado").classList.remove("hidden");
      });

      // Imprimir presupuesto
      document.getElementById("comprar-btn").addEventListener("click", function() {
        const resultado = document.getElementById("resultado");
        if (resultado.classList.contains("hidden")) {
          alert("Primero debes calcular el total para imprimir el presupuesto.");
          return;
        }
        // Imprimir solo el resumen
        const originalBody = document.body.innerHTML;
        const resumenHtml = resultado.innerHTML;
        document.body.innerHTML = `<div style='max-width:600px;margin:0 auto;'>${resumenHtml}</div>`;
        window.print();
        document.body.innerHTML = originalBody;
        location.reload();
      });
    });

    function exportarPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const resumen = document.getElementById("resumen");
      let y = 10;

      // Extraer datos del resumen
      const cliente = resumen.querySelector("p").innerText;
      doc.text(cliente, 10, y);
      y += 12;

      const items = resumen.querySelectorAll("ul li");
      for (let item of items) {
        const texto = item.textContent.trim();
        doc.text(texto, 10, y);
        y += 10;
      }

      // Extraer totales
      const totales = resumen.querySelectorAll("p:not(:first-child)");
      for (let p of totales) {
        doc.text(p.innerText, 10, y);
        y += 10;
      }

      doc.save("presupuesto.pdf");
    }