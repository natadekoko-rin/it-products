import MText from "@/components/common/text";
import { useEffect, useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, useColorScheme, StyleSheet, View,
} from "react-native";
import { Image } from 'expo-image';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Endpoint } from "../utils/const";
import { apiRequest } from "../utils/apiHelper";
import MGap from "@/components/common/gap";
import { LoadingIndicator } from "@/components/common/loading-indicator";
import { createProduct } from "../store/slices/productSlice";
import { useRouter } from "expo-router";

export default function AddProductScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const themeBg = isDark ? '#000000' : '#FFFFFF';
  const themeText = isDark ? '#F3F4F6' : '#11181C';

  const SAMPLE_IMAGES = [
    { id: 'headphones', label: '1', url: 'https://picsum.photos/300/180?image=503' },
    { id: 'shoes', label: '2', url: 'https://picsum.photos/350/165?random' },
    { id: 'camera', label: '3', url: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg' },
    { id: 'jacket', label: '4', url: 'https://picsum.photos/500/300?image=232' },
  ];


  const [title, setTitle] = useState('');
  const { isLoading } = useAppSelector((state) => state.product);
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].url);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Product title cannot be empty.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Product description cannot be empty.');
      return;
    }

    try {
      const resultAction = await dispatch(
        createProduct({
          title: title.trim(),
          price: priceNum,
          category,
          description: description.trim(),
          image: selectedImage,
        })
      );

      if (createProduct.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Product added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setPrice('');
              setCategory('beauty');
              setDescription('');
              setSelectedImage(SAMPLE_IMAGES[0].url);
              router.replace('/(tabs)');
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to add product.');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await apiRequest(`${Endpoint.BASE_PRODUCTS}/categories`);
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].slug); // default to first category slug
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <MText text="Add Product" size={20} weight="800" color={themeText} style={styles.headerTitle} />
          <MGap size={2} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View>
            <MText text="Product Name" size={14} weight="700" color={themeText} />
            <MGap size={8} />
            <TextInput
              style={[styles.input, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
              placeholder="Enter product name"
              placeholderTextColor={themeText}
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>
          <MGap size={20} />

          <View>
            <MText text="Price($)" size={14} weight="700" color={themeText} />
            <MGap size={8} />
            <TextInput
              style={[styles.input, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
              placeholder="Enter product price"
              placeholderTextColor={themeText}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              editable={!isLoading}
            />
          </View>
          <MGap size={20} />

          <View>
            <MText text="Category" size={14} weight="700" color={themeText} />
            <MGap size={8} />
            {isCategoriesLoading ? (
              <LoadingIndicator
                size="small"
                fullscreen={false}
                color={themeText}
                backgroundColor={themeBg}
                style={{ alignSelf: 'flex-start', padding: 8 }} />
            ) : (
              <View style={styles.categoryChipsContainer}>
                {categories.map((cat) => {
                  const isSelected = category === cat.slug;
                  const chipBg = isSelected ? themeText : themeBg;
                  const chipTextColor = isSelected ? themeBg : themeText;
                  return (
                    <TouchableOpacity
                      key={cat.slug}
                      style={[styles.chip, { backgroundColor: chipBg, borderColor: themeText }]}
                      onPress={() => setCategory(cat.slug)}
                      disabled={isLoading}
                    >
                      <MText
                        text={cat.name}
                        size={13}
                        weight="600"
                        color={chipTextColor}
                        style={styles.chipText}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          <MGap size={20} />

          <View>
            <MText text="Product Image" size={14} weight="700" color={themeText} />
            <MGap size={2} />
            <MText text="Select photo sample for product" size={12} color={themeText} style={{ opacity: 0.7 }} />
            <MGap size={8} />
            <View style={styles.imageSelector}>
              {SAMPLE_IMAGES.map((img) => {
                const isSelected = selectedImage === img.url;
                return (
                  <TouchableOpacity
                    key={img.id}
                    style={[styles.imageOption, { borderColor: isSelected ? themeText : 'transparent' }]}
                    onPress={() => setSelectedImage(img.url)}
                    disabled={isLoading}
                  >
                    <Image
                      source={{ uri: img.url }}
                      style={styles.sampleImage}
                      contentFit="cover"
                    />
                    <View style={styles.imageLabelContainer}>
                      <MText text={img.label} size={10} weight={isSelected ? '700' : '600'} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <MGap size={20} />

          <View>
            <MText text="Description" size={14} weight="700" color={themeText} />
            <MGap size={8} />
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: themeText, color: themeText, backgroundColor: themeBg }]}
              placeholder="Write a descriptive summary of the product ..."
              placeholderTextColor={themeText}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              editable={!isLoading}
            />
          </View>
          <MGap size={30} />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: themeText }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingIndicator size="small" fullscreen={false} color={themeBg} style={{ padding: 0 }} />
            ) : (
              <MText text="Add" size={16} weight="700" color={themeBg} style={styles.submitButtonText} />
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    textTransform: 'capitalize',
  },
  imageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  imageOption: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
  },
  sampleImage: {
    width: '100%',
    height: '100%',
  },
  imageLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    letterSpacing: 0.5,
  },
});
