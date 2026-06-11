import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProduct, deleteProduct } from '../store/slices/productSlice';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LoadingIndicator } from '@/components/common/loading-indicator';
import MCard from '@/components/common/card';
import MText from '@/components/common/text';
import MGap from '@/components/common/gap';
import { apiRequest } from '../utils/apiHelper';

export default function ProductDetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeText = isDark ? '#FFFFFF' : '#000000';
  const themeBg = isDark ? '#000000' : '#FFFFFF';
  const { products, isLoading } = useAppSelector((state) => state.product);
  const reduxProduct = products.find((p) => p.id === id);

  const [apiProduct, setApiProduct] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);



  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsDetailLoading(true);
        setDetailError(null);
        const data = await apiRequest(`/products/${id}`);
        setApiProduct(data);
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setDetailError(err.message || 'Failed to load product details');
      } finally {
        setIsDetailLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const product = {
    ...reduxProduct,
    ...apiProduct,
    title: reduxProduct?.title || apiProduct?.title || '',
    price: reduxProduct?.price ?? apiProduct?.price ?? 0,
    description: reduxProduct?.description || apiProduct?.description || '',
    image: reduxProduct?.image || apiProduct?.thumbnail || (apiProduct?.images && apiProduct?.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(product.title || '');
  const [editPrice, setEditPrice] = useState(product.price.toString() || '');
  const [editDesc, setEditDesc] = useState(product.description || '');

  useEffect(() => {
    if (product) {
      setEditTitle(product.title || '');
      setEditPrice(product.price ? product.price.toString() : '');
      setEditDesc(product.description || '');
    }
  }, [product.title, product.price, product.description]);

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Validation Error', 'Product title cannot be empty.');
      return;
    }

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    if (!editDesc.trim()) {
      Alert.alert('Validation Error', 'Product description cannot be empty.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateProduct({
          id: id!,
          title: editTitle.trim(),
          price: priceNum,
          description: editDesc.trim(),
        })
      );
      if (updateProduct.fulfilled.match(resultAction)) {
        setIsEditing(false);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update product details.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product?.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const resultAction = await dispatch(deleteProduct(id!));
              if (deleteProduct.fulfilled.match(resultAction)) {
                Alert.alert('Success', 'Product deleted successfully!', [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/(tabs)'),
                  },
                ]);
              } else {
                Alert.alert('Error', 'Failed to delete product.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (isDetailLoading && !reduxProduct) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeBg }, styles.center]}>
        <LoadingIndicator size="large" fullscreen={true} color={themeText} backgroundColor={themeBg} />
      </SafeAreaView>
    );
  }

  if (!reduxProduct && !apiProduct) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeBg }, styles.center]}>
        <MaterialIcons name="error-outline" size={64} color={themeText} />
        <MGap size={16} />
        <MText text={detailError || "Product Not Found"} size={18} weight="600" color={themeText} />
        <MGap size={20} />
        <TouchableOpacity style={[styles.backButton, { backgroundColor: themeText }]} onPress={() => router.back()}>
          <MText text="Go Back" size={14} weight="600" color={themeBg} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <MCard style={[styles.header, { borderBottomColor: themeText, backgroundColor: themeBg }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={themeText} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <MText text="Product Details" size={18} weight="700" color={themeText} />
        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={22} color={themeText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { marginLeft: 8 }]}
            onPress={() => {
              if (!isEditing) {
                setEditTitle(product.title);
                setEditPrice(product.price.toString());
                setEditDesc(product.description);
              }
              setIsEditing(!isEditing);
            }}
          >
            <MaterialIcons name={isEditing ? 'close' : 'edit'} size={22} color={themeText} />
          </TouchableOpacity>
        </View>
      </MCard>

      {isLoading && (
        <LoadingIndicator size="small" fullscreen={false} color={themeText} backgroundColor={themeBg} style={{ padding: 12 }} />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: product.image }} style={styles.productImage} contentFit="cover" transition={200} />

        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <MCard style={[styles.badge, { borderColor: themeText }]}>
              <MText text={product.category} size={12} weight="700" color={themeText} style={{ textTransform: 'uppercase' }} />
            </MCard>
            {product.rating && (
              <MCard style={[styles.badge, { borderColor: themeText, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                <MaterialIcons name="star" size={16} color={themeText} />
                <MText text={product.rating.toFixed(2)} size={12} weight="700" color={themeText} />
              </MCard>
            )}
          </View>
          <MGap size={12} />

          {isEditing ? (
            <View>
              <MText text="Edit Title" size={14} weight="700" color={themeText} />
              <MGap size={6} />
              <TextInput
                style={[styles.input, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <MGap size={12} />

              <MText text="Edit Price ($)" size={14} weight="700" color={themeText} />
              <MGap size={6} />
              <TextInput
                style={[styles.input, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
                keyboardType="numeric"
                value={editPrice}
                onChangeText={setEditPrice}
              />
              <MGap size={12} />

              <MText text="Edit Description" size={14} weight="700" color={themeText} />
              <MGap size={6} />
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
                multiline
                numberOfLines={3}
                value={editDesc}
                onChangeText={setEditDesc}
              />
              <MGap size={20} />

              <TouchableOpacity style={[styles.saveButton, { backgroundColor: themeText }]} onPress={handleUpdate}>
                <MText text="Save" size={15} weight="700" color={themeBg} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MText text={product.title} size={24} weight="800" color={themeText} />
              <MGap size={8} />
              <MText text={`$${product.price.toFixed(2)}`} size={22} weight="800" color={themeText} />
              <MGap size={16} />

              <View style={[styles.divider, { backgroundColor: themeText }]} />
              <MGap size={16} />

              <MText text="Description" size={16} weight="700" color={themeText} />
              <MGap size={8} />
              <MText text={product.description} size={15} color={themeText} style={styles.description} />
              <MGap size={24} />

              <MCard style={[styles.specsCard, { borderColor: themeText, backgroundColor: themeBg }]}>
                <MText text="Specifications" size={16} weight="700" color={themeText} />
                <MGap size={12} />
                {product.brand && (
                  <View style={styles.specRow}>
                    <MText text="Brand" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={product.brand} size={14} weight="600" color={themeText} />
                  </View>
                )}

                {product.stock !== undefined && (
                  <View style={styles.specRow}>
                    <MText text="Stock" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={`${product.stock} units`} size={14} weight="600" color={themeText} />
                  </View>
                )}
                {product.availabilityStatus && (
                  <View style={styles.specRow}>
                    <MText text="Availability" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={product.availabilityStatus} size={14} weight="700" color={themeText} />
                  </View>
                )}
                {product.warrantyInformation && (
                  <View style={styles.specRow}>
                    <MText text="Warranty" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={product.warrantyInformation} size={14} weight="600" color={themeText} />
                  </View>
                )}
                {product.shippingInformation && (
                  <View style={styles.specRow}>
                    <MText text="Shipping Info" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={product.shippingInformation} size={14} weight="600" color={themeText} />
                  </View>
                )}
                {product.returnPolicy && (
                  <View style={styles.specRow}>
                    <MText text="Return Policy" size={14} color={themeText} style={{ opacity: 0.7 }} />
                    <MText text={product.returnPolicy} size={14} weight="600" color={themeText} />
                  </View>
                )}
              </MCard>

              {/* review */}
              {product.reviews && product.reviews.length > 0 && (
                <View>
                  <MGap size={24} />
                  <MText text="Product reviews" size={18} weight="800" color={themeText} />
                  <MGap size={12} />
                  {product.reviews.map((review: any, index: number) => (
                    <View key={index}>
                      <MCard style={[styles.reviewCard, { borderColor: themeText, backgroundColor: themeBg }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <MText text={review.reviewerName} size={14} weight="700" color={themeText} />
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star" size={14} color={themeText} />
                            <MText text={review.rating.toString()} size={12} weight="700" color={themeText} style={{ marginLeft: 2 }} />
                          </View>
                        </View>
                        <MGap size={4} />
                        <MText text={new Date(review.date).toLocaleDateString()} size={11} color={themeText} style={{ opacity: 0.6 }} />
                        <MGap size={8} />
                        <MText text={review.comment} size={13} color={themeText} style={{ lineHeight: 18, opacity: 0.85 }} />
                      </MCard>
                      {index < product.reviews.length - 1 && <MGap size={12} />}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 56,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  productImage: {
    width: '100%',
    height: 250,
  },
  infoSection: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    opacity: 0.2,
  },
  description: {
    lineHeight: 22,
    opacity: 0.8,
  },
  specsCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
