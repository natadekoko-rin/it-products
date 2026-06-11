import { apiRequest } from "@/app/utils/apiHelper";
import { Endpoint } from "@/app/utils/const";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




const mappingApiProduct = (apiProduct: any): Product => ({
  id: apiProduct.id.toString(),
  title: apiProduct.title,
  price: apiProduct.price,
  description: apiProduct.description,
  category: apiProduct.category,
  image: apiProduct.thumbnail ||
    (apiProduct.images && apiProduct.images[0]) ||
    'https://img.freepik.com/free-vector/hand-drawn-flat-news-report-design_23-2150012956.jpg?semt=ais_hybrid&w=740&q=80',
  images: apiProduct.images || [],
  thumbnail: apiProduct.thumbnail || '',
  brand: apiProduct.brand,
  rating: apiProduct.rating,
  stock: apiProduct.stock,
  availabilityStatus: apiProduct.availabilityStatus,
  warrantyInformation: apiProduct.warrantyInformation,
  shippingInformation: apiProduct.shippingInformation,
  returnPolicy: apiProduct.returnPolicy,
});


export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await apiRequest(`${Endpoint.BASE_PRODUCTS}?limit=100`);
    return response.products.map(mappingApiProduct);
  } catch (error: any) {
    return rejectWithValue(error.message || 'gagal list product');
  }
});

export const searchProducts = createAsyncThunk('products/searchProducts', async (query: string, { rejectWithValue }) => {
  try {
    const response = await apiRequest(`${Endpoint.SEARCH_PRODUCTS}${encodeURIComponent(query)}`);
    return response.products.map(mappingApiProduct);
  } catch (error: any) {
    return rejectWithValue(error.message || 'gagal search product');
  }
});

export const createProduct = createAsyncThunk('products/createProduct',
  async (productData: Omit<Product, 'id' | 'images' | 'thumbnail'>, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`${Endpoint.BASE_PRODUCTS}/add`, {
        method: 'POST',
        body: {
          title: productData.title,
          price: productData.price,
          category: productData.category,
          description: productData.description,
        },
      });

      const mapped = mappingApiProduct(response);
      return {
        ...mapped,
        image: productData.image,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'gagal add product');
    }
  }
);

export const updateProduct = createAsyncThunk('products/updateProduct',
  async (payload: { id: string; title: string; price: number; description: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`${Endpoint.BASE_PRODUCTS}/${payload.id}`, {
        method: 'PUT',
        body: {
          title: payload.title,
          price: payload.price,
          description: payload.description,
        },
      });
      return mappingApiProduct(response);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk('products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`${Endpoint.BASE_PRODUCTS}/${id}`, {
        method: 'DELETE',
      });
      return { id, isDeleted: response.isDeleted };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);


export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // compatibility with our listing UI (maps to thumbnail or image[0])
  images: string[];
  thumbnail: string;
  brand?: string;
  rating?: number;
  stock?: number;
  availabilityStatus?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //list products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //search
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //add
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.products.unshift(action.payload); // add locally so user sees it
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //update
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //delete
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ id: string; isDeleted: boolean }>) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => p.id !== action.payload.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});


export default productSlice.reducer;