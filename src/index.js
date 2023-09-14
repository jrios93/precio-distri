const searchInput = document.getElementById("search-input");
const exchangeRateInput = document.getElementById("exchange-rate");
const discountSelect = document.getElementById("discount-select");
const productsContainer = document.getElementById("products-container");
const toggle = document.getElementById("toggleMod");
const toggleLabel = document.getElementById("toggleLabel");
const productFragment = document.createDocumentFragment();
let currentProduct = {};
const carrito = [];

const modelDescription = document.getElementById("decriptionModal");
const modalElement = document.getElementById("modalContainer");
function openModal() {
  // modalElement.classList.remove('invisible')
  modalElement.classList.remove("invisible");
  modelDescription.textContent = currentProduct.descripcion;
}
function closeModal() {
  // modalElement.classList.remove('visible');
  modalElement.classList.add("invisible");
}

const addButton = document.getElementById("addItem");
addButton.addEventListener("click", function () {
  carrito.push(currentProduct);
  console.log(carrito);
  closeModal();
});

const buttonModal = document.getElementById("btnModal-close");
buttonModal.addEventListener("click", function () {
  closeModal();
});

toggle.addEventListener("change", function () {
  // Verifica si el toggle está marcado (activado)
  if (toggle.checked) {
    // Cambia el texto del label cuando el toggle está activado
    toggleLabel.textContent = "Online";
    priceLibreRadio.classList.add("invisible");
  } else {
    // Cambia el texto del label cuando el toggle está desactivado
    toggleLabel.textContent = "Distribución";
    priceLibreRadio.classList.remove("invisible");
  }
});
toggle.addEventListener("change", updateProducts);

let products = [];

fetch("archivo-13v2.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    updateProducts();
  })
  .catch((error) => console.error("Error al cargar los productos:", error));

const priceFacturadoRadio = document.getElementById("price-facturado-radio");
priceFacturadoRadio.addEventListener("change", updateProducts);

const priceLibreRadio = document.getElementById("price-libre-radio");
priceLibreRadio.addEventListener("change", updateProducts);

function updateProducts() {
  const searchKeyword = searchInput.value.toLowerCase().split(" ");
  const exchangeRate = parseFloat(exchangeRateInput.value);
  const selectedDiscount = parseFloat(discountSelect.value);
  const selectedOption = document.querySelector(
    'input[name="price-option"]:checked'
  ).value;
  const toggleState = toggleLabel.textContent;

  const filteredProducts = products.filter((product) => {
    return searchKeyword.every((keyword) => {
      return (
        product.descripcion.toLowerCase().includes(keyword) ||
        product.marca.toLowerCase().includes(keyword) ||
        product.codigo.toString().includes(keyword) ||
        product.subcategoria.toLowerCase().includes(keyword)
      );
    });
  });

  // Ordenar productos por precio
  filteredProducts.sort((a, b) => a.preciof - b.preciof);

  filteredProducts.sort((a, b) => {
    const aIsBrandMatch = a.marca.toLowerCase().includes(searchKeyword[0]);
    const bIsBrandMatch = b.marca.toLowerCase().includes(searchKeyword[0]);

    if (aIsBrandMatch && !bIsBrandMatch) {
      return -1;
    }
    if (!aIsBrandMatch && bIsBrandMatch) {
      return 1;
    }

    const aStartsWithSearch = a.descripcion
      .toLowerCase()
      .startsWith(searchKeyword[0]);
    const bStartsWithSearch = b.descripcion
      .toLowerCase()
      .startsWith(searchKeyword[0]);

    if (aStartsWithSearch && !bStartsWithSearch) {
      return -1;
    }
    if (!aStartsWithSearch && bStartsWithSearch) {
      return 1;
    }

    return 0;
  });

  productFragment.innerHTML = "";

  filteredProducts.forEach((product) => {
    let priceLocal;
    let discountedPrice;
    let priceFifi;
    // const finalPrice =
    //   selectedOption === "Facturado" ? product.preciof : product.preciol;
    const productCard = document.createElement("div");
    productCard.classList.add("product-card", "relative");
    // add event to capture double click with content of product
    productCard.addEventListener("click", function () {
      clickCount++;
      if (clickCount === tripleClickThreshold) {
        console.log("se hizo doble click", product);
        openModal();
        currentProduct = product;
        clickCount = 0;
      }
    });

    if (selectedOption === "Facturado") {
      discountedPrice = (product.preciof * selectedDiscount).toFixed(2);
      priceFifi = `${discountedPrice.toString()}+igv`;
      priceLocal =
        (discountedPrice * exchangeRate * 1.18).toFixed(2).toString() +
        "(inc.igv)";
    } else if (selectedOption === "Libre") {
      discountedPrice = (product.preciol * selectedDiscount * 1.18).toFixed(2);
      priceFifi = `${discountedPrice.toString()}`;
      priceLocal = (discountedPrice * exchangeRate).toFixed(2);
    }

    let viewDiscount = "";

    if (selectedDiscount === 0.99) {
      viewDiscount = "-1%";
    } else if (selectedDiscount === 0.98) {
      viewDiscount = "-2%";
    } else if (selectedDiscount === 0.97) {
      viewDiscount = "-3%";
    } else if (selectedDiscount === 0.96) {
      viewDiscount = "-4%";
    } else {
      viewDiscount = "";
    }
    const abreSelectOption = selectedOption === "Facturado" ? "Fact." : "Libre";

    if (toggleState === "Online") {
      discountedPrice = (product.preciol * selectedDiscount * 1.18).toFixed(2);
      priceLocal = (discountedPrice * exchangeRate).toFixed(2);

      productCard.innerHTML = `
      <div class="subproduct-card" id='${product.codigo}'>
        <div class="px-4 pb-3 pt-4 border-b border-gray-300 bg-white flex justify-between">
          <div class="text-xs uppercase font-bold text-gray-600 tracking-wide">COD: <span class="font-normal">${
            product.codigo
          }</span></div>
          <div class="text-xs uppercase font-bold text-gray-600 tracking-wide ">Descuento: <span class="font-normal text-sm text-white bg-orange-500">${viewDiscount}</span></div>
          </div>
        <div class="p-4 text-gray-700 flex justify-between items-start">
          <div>
            <p class="text-lg text-stone-900 leading-none my-1 font-bold">${
              product.descripcion
            }</p>
            <p class="text-sm w-56">Stock: ${product.stock} uds.</p>
          </div>

        </div>
        <div class="flex justify-between items-center p-4 border-t border-gray-300 text-gray-600">
          <div class="flex items-center">
						<p><span class="text-sm pr-1">Precio soles (inc.igv):</span> <span class="text-gray-900 font-bold"> S/${(
              priceLocal * 1.1
            ).toFixed(2)}</span></p>
          </div>
        
      </div>
    </div>
  `;
    } else {
      productCard.innerHTML = `
      <div class="subproduct-card relative " id='${product.codigo}'>
        <div class="px-4 pb-3 pt-4 border-b border-gray-300 bg-white flex justify-between">
         <div class="text-xs uppercase font-bold text-gray-600 tracking-wide">COD: <span class="font-normal">${product.codigo}</span>
         </div>
          <div class="text-xs uppercase font-bold text-gray-600 tracking-wide ">Descuento: <span class="font-normal text-sm text-white bg-orange-500">${viewDiscount}</span></div>
      </div>
      <div class="p-4 text-gray-700 flex justify-between items-start">
        <div>
          <p class="text-lg text-stone-900 leading-none my-1 font-bold">${product.descripcion}</p>
          <p class="text-sm w-56 ">Stock: ${product.stock} uds.</p>
        </div>
        

      </div>
      <div class=" justify-between items-center p-4 border-t border-gray-300 text-gray-600">
        <div class="flex items-center">
          <p><span class="lg:text-xs pr-1">${abreSelectOption} Dolares:</span><span class="text-gray-900 font-bold lg:text-xs">$${priceFifi}</span></p>
        </div>

        <div class="flex items-center">
					<p><span class="lg:text-xs pr-1">Tc:</span><span class="text-gray-900 font-bold lg:text-xs">${exchangeRate}</span></p>
        </div>
  

        <div class="flex items-center">
						<p><span class="lg:text-xs pr-1">${abreSelectOption} Soles:</span><span class="text-gray-900 font-bold lg:text-xs">S/${priceLocal}</span></p>
        </div>
      
      </div>
    </div> 
  </div>
        `;
    }

    const containerBtn = document.createElement("div");
    const copyButton = document.createElement("button");
    const viewStock = document.createElement("button");
    containerBtn.appendChild(copyButton);
    containerBtn.appendChild(viewStock);
    containerBtn.classList.add("ctn-btn");
    viewStock.classList.add("btn-stock");
    copyButton.classList.add("btn-copy");
    copyButton.textContent = "Copiar";
    viewStock.textContent = "Ver Almacen";
    const tempDiv = productCard.querySelector("div");
    tempDiv.appendChild(containerBtn);

    copyButton.addEventListener("click", function () {
      const tempTextarea = document.createElement("textarea");

      if (toggleState === "Online") {
        discountedPrice = (product.preciol * selectedDiscount * 1.18).toFixed(
          2
        );
        priceLocal = (discountedPrice * exchangeRate).toFixed(2);
        tempTextarea.value = `Cod:${product.codigo}\n------------------\n${
          product.descripcion
        }\nStock:${product.stock}\n------------------\nPrecio Online: S/${(
          priceLocal * 1.1
        ).toFixed(2)}`;
      } else {
        tempTextarea.value = `Mod: ${selectedOption}\nCod: ${product.codigo}\n------------------\n${product.descripcion}\nStock: ${product.stock}\n--------------------\n${abreSelectOption} Dolares: *$${priceFifi}*\nTc: ${exchangeRate}\n${abreSelectOption} Soles: *S/${priceLocal}*\n`;
      }
      const alertCopy = document.createElement("div");
      alertCopy.classList.add("alert-copy");
      const contentAlert = document.createElement("p");
      contentAlert.textContent = "copiado";
      alertCopy.appendChild(contentAlert);
      productCard.appendChild(alertCopy);

      setTimeout(function () {
        alertCopy.style.display = "none";
      }, 2000);

      document.body.appendChild(tempTextarea);

      tempTextarea.select();
      navigator.clipboard.writeText(tempTextarea.value);

      document.body.removeChild(tempTextarea);
    });

    const viewStore = document.createElement("div");
    viewStore.classList.add("modalAlmacen");

    const store = [
      { nombre: "PRI", stock: product.principal },
      { nombre: "T04", stock: product.cajaCuatro },
      { nombre: "T06", stock: product.cajaSeis },
      { nombre: "T08", stock: product.cajaOcho },
      { nombre: "T10", stock: product.cajaDiez },
      { nombre: "T11", stock: product.cajaOnce },
      { nombre: "T12", stock: product.cajaDoce },
      { nombre: "T13", stock: product.cajaTrece },
      { nombre: "T14", stock: product.cajaCatorce },
      { nombre: "T15", stock: product.cajaQuince },
    ];

    viewStock.addEventListener("mouseover", function () {
      viewStore.innerHTML = "";
      addP = document.createElement("p");
      addP.classList.add(
        "font-bold",
        "my-1",
        "border-b",
        "border-gray-300",
        "text-gray-600"
      );
      addP.textContent = `Codigo:${product.codigo}`;
      viewStore.append(addP);
      store.forEach(function (almacen) {
        if (almacen.stock !== 0) {
          const pElement = document.createElement("p");
          let unitarios = "";
          if (almacen.stock == 1) {
            unitarios = "und.";
          } else {
            unitarios = "unds.";
          }
          pElement.textContent = `${almacen.nombre} : ${almacen.stock} ${unitarios}`;
          pElement.classList.add("text-sm");
          viewStore.appendChild(pElement);
        }
        viewStore.style.display = "grid";
      });

      viewStock.addEventListener("mouseout", function () {
        viewStore.style.display = "none";
      });

      // Agrega eventos para dispositivos móviles
      viewStock.addEventListener("touchstart", function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado (por ejemplo, abrir un enlace)
        viewStore.innerHTML = "";
        addP = document.createElement("p");
        addP.classList.add(
          "font-bold",
          "my-1",
          "border-b",
          "border-gray-300",
          "text-gray-600"
        );
        addP.textContent = `Codigo:${product.codigo}`;
        viewStore.append(addP);
        store.forEach(function (almacen) {
          if (almacen.stock !== 0) {
            const pElement = document.createElement("p");
            let unitarios = "";
            if (almacen.stock == 1) {
              unitarios = "und.";
            } else {
              unitarios = "unds.";
            }
            pElement.textContent = `${almacen.nombre} : ${almacen.stock} ${unitarios}`;
            pElement.classList.add("text-sm");
            viewStore.appendChild(pElement);
          }
          viewStore.style.display = "grid";
        });
      });

      viewStock.addEventListener("touchend", function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado (por ejemplo, abrir un enlace)
        viewStore.style.display = "none";
      });

      productCard.appendChild(viewStore);
    });

    productFragment.appendChild(productCard);
  });

  productsContainer.innerHTML = "";
  productsContainer.appendChild(productFragment);
}

let debounceTimeout;

searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(updateProducts, 300);
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    searchInput.value = "";
  }
});

exchangeRateInput.addEventListener("input", updateProducts);
discountSelect.addEventListener("change", updateProducts);
searchInput.focus();
