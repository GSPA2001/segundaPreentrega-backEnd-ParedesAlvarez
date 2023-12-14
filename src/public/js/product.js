document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('addToCart')) {
            const productId = event.target.getAttribute('data-product-id');
            addToCart(productId);

            Toastify({
                text: 'Nuevo producto agregado exitosamente',
                duration: 2200,
                newWindow: true,
                close: true,
                gravity: 'top', // `top` or `bottom`
                position: 'center', // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#b1ffa4d1",
                    borderRadius: "10px",
                    fontWeight: "600",
                },
                onClick: function () {}, // Callback after click
            }).showToast();
        }
    });
});

function addToCart(productId) {
    console.log('Agregado al carrito: ' + productId);
}