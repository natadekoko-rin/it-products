import { Image } from 'expo-image';
import { Dimensions, FlatList, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../store/slices/productSlice';
import MText from '@/components/common/text';
import MCard from '@/components/common/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingIndicator } from '@/components/common/loading-indicator';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#000000' : '#FFFFFF';

  const [searchQuery, setSearchQuery] = useState('');
  const { products, isLoading, error } = useAppSelector((state) => state.product);
  //first mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        dispatch(searchProducts(searchQuery));
      } else {
        dispatch(fetchProducts());
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const textThemeColor = isDark ? '#FFFFFF' : '#000000';

  const renderItem = ({ item }: { item: typeof products[0] }) => {
    const textThemeColor = isDark ? '#FFFFFF' : '#000000';

    return (
      <MCard
        style={[styles.productCard, { backgroundColor: bgColor, borderColor: textThemeColor }]}
        onPress={() => router.push({ pathname: '/product/detail', params: { id: item.id } })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" transition={200} />
        <MCard style={{ padding: 12, borderRadius: 0 }}>
          <MText text={item.category} size={10} weight="700" color={textThemeColor} style={{ textTransform: 'uppercase', marginBottom: 4 }} />
          <MText text={item.title} size={14} weight="700" color={textThemeColor} numberOfLines={1} style={{ marginBottom: 4 }} />
          <MText text={`$${item.price.toFixed(2)}`} size={15} weight="800" color={textThemeColor} />
        </MCard>
      </MCard>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <MCard style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 2, borderRadius: 0 }}>
        <MText text="List Products" size={20} weight="800" color={textThemeColor} style={{ letterSpacing: 0.5 }} />
      </MCard>

      {/* searhc bar */}
      <MCard style={
        [styles.searchContainer, { backgroundColor: bgColor, borderColor: textThemeColor }]}>
        <TextInput
          style={
            [
              styles.searchInput,
              { color: textThemeColor }
            ]
          }
          placeholder="Search"
          placeholderTextColor={textThemeColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={textThemeColor} />
          </TouchableOpacity>
        )}
      </MCard>

      {/* handler 3 condition */}
      {isLoading && products.length === 0 ? (
        <LoadingIndicator size="large" fullscreen={true} color={textThemeColor} backgroundColor={bgColor} />
      ) : error ? (
        <MCard style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color={textThemeColor} />
          <MText text={error} size={16} weight="600" color={textThemeColor} style={{ marginTop: 16, textAlign: 'center' }} />
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: textThemeColor, borderColor: textThemeColor }]}
            onPress={() => dispatch(fetchProducts())}
          >
            <MText text="Retry" size={14} weight="700" color={bgColor} />
          </TouchableOpacity>
        </MCard>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <MCard style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={64} color={textThemeColor} />
              <MText text="no products found" size={18} weight="700" color={textThemeColor} style={{ marginTop: 16 }} />
              <MText text="try anither keyword" size={14} color={textThemeColor} style={{ marginTop: 4, textAlign: 'center' }} />
            </MCard>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: '100%',
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: cardWidth,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 0,
    borderRadius: 8,
  },
  productImage: {
    width: '100%',
    height: cardWidth * 0.9,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
});
