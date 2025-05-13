import { redirect } from 'react-router-dom';
import { getCurrentUserToken } from "../Functions/HandleAuth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function fetchWithAuth(url, options = {}) {
    const token = getCurrentUserToken();
    if (!token) {
        throw new Error("Authentication required.");
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch(url, { ...options, headers, mode: 'cors' });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            const pathname = new URL(window.location.href).pathname;
            throw redirect(`/login?redirectTo=${pathname}`);
        }
        const errorData = await response.json();
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


export async function fetchAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Failed to fetch all products:", error);
        throw error;
    }
}

export async function fetchProductById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Product with ID ${id} not found.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error(`Failed to fetch product with ID ${id}:`, error);
        throw error;
    }
}


export async function fetchProductReviews(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Failed to fetch reviews for product ${productId}:`, error);
        throw error;
    }
}

export async function addProductReview(productId, rating, comment) {
    return fetchWithAuth(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
    });
}

export async function updateTotalProductReviews(productId, reviews, rating) {
    return fetchWithAuth(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ reviews, rating })
    });
}


export async function fetchUserDetails() {
    return fetchWithAuth(`${API_BASE_URL}/users/me`, { method: 'GET' });
}


export async function fetchUserCart() {
    return fetchWithAuth(`${API_BASE_URL}/me/cart`, { method: 'GET' });
}

export async function addToCart(productId, quantity, size) {
    return fetchWithAuth(`${API_BASE_URL}/me/cart`, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, size })
    });
}

export async function updateCartItem(productId, quantity, size) {
    return fetchWithAuth(`${API_BASE_URL}/me/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity, size })
    });
}

export async function removeFromCart(productId) {
    return fetchWithAuth(`${API_BASE_URL}/me/cart/${productId}`, {
        method: 'DELETE'
    });
}

export async function clearCart() {
    return fetchWithAuth(`${API_BASE_URL}/me/cart`, {
        method: 'DELETE'
    });
}


export async function fetchUserWishlist() {
    return fetchWithAuth(`${API_BASE_URL}/users/me/wishlist`, { method: 'GET' });
}

export async function addToWishlist(productId) {
    return fetchWithAuth(`${API_BASE_URL}/users/me/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ productId })
    });
}

export async function removeFromWishlist(productId) {
    return fetchWithAuth(`${API_BASE_URL}/users/me/wishlist/${productId}`, {
        method: 'DELETE'
    });
}


export async function fetchUserAddresses() {
    return fetchWithAuth(`${API_BASE_URL}/users/me/addresses`, { method: 'GET' });
}

export async function addUserAddress(addressData) {
    return fetchWithAuth(`${API_BASE_URL}/users/me/addresses`, {
        method: 'POST',
        body: JSON.stringify(addressData)
    });
}

export async function updateUserAddress(addressId, addressData) {
    return fetchWithAuth(`${API_BASE_URL}/users/me/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
    });
}

export async function removeUserAddress(addressId) {
    return fetchWithAuth(`${API_BASE_URL}/users/me/addresses/${addressId}`, {
        method: 'DELETE'
    });
}


export async function fetchUserOrders() {
    return fetchWithAuth(`${API_BASE_URL}/me/orders`, { method: 'GET' });
}

export async function placeOrder(shippingAddressId, items) {
    return fetchWithAuth(`${API_BASE_URL}/me/orders`, {
        method: 'POST',
        body: JSON.stringify({ shippingAddressId, items })
    });
}