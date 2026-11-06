import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
  Alert,
} from 'react-native';

type ScreenType =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'menu'
  | 'about'
  | 'dish-detail'
  | 'cart'
  | 'add-dish';

type CategoryType = 'All' | 'Popular' | 'Mains' | 'Starters' | 'Desserts';
type AuthMethod = 'username' | 'phone';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface DishItem {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  price: number;
  rating: number;
  prepTime: string;
  calories: string;
  imageUrl: string;
  isPopular?: boolean;
}

const INITIAL_DISHES: DishItem[] = [
  {
    id: '1',
    name: 'Truffle Glazed Steak Burger',
    description: 'Aged Black Angus beef, smoked gouda, caramelized onions, and black truffle aioli on a toasted brioche bun.',
    category: 'Mains',
    price: 18.99,
    rating: 4.9,
    prepTime: '15-20 min',
    calories: '650 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Pan-Seared Salmon Bowl',
    description: 'Wild salmon with avocado, edamame, cucumber, sticky jasmine rice, and warm ponzu drizzle.',
    category: 'Mains',
    price: 21.50,
    rating: 4.8,
    prepTime: '12-15 min',
    calories: '520 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
  },
  {
    id: '3',
    name: 'Crispy Artisan Burrata Tart',
    description: 'Creamy Italian burrata, heirloom cherry tomatoes, fresh pesto, and balsamic glaze on warm sourdough.',
    category: 'Starters',
    price: 14.00,
    rating: 4.7,
    prepTime: '10 min',
    calories: '410 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Molten Lava Chocolate Cake',
    description: 'Warm dark chocolate ganache center served with Madagascar vanilla bean gelato.',
    category: 'Desserts',
    price: 11.50,
    rating: 5.0,
    prepTime: '8 min',
    calories: '480 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
  },
];

const CUSTOM_BANNER_URL =
  'https://lh3.googleusercontent.com/gg/ACRwjas3LacivvWIRdRUPa_YOi0SGP1RSrzPW07tHMpZ-RVnEKkIhxbObNQOGQNlPnO34oLVtX2zxXPSSQwQl5oSZEjS50mUlFQ7PorHhPUScQNz4V54nMeran_SP1x2K890CB7ROACMlI048dZiUy9EH8fS-iudeMogJd9jxKMUcPos_piyXmrUfp2B8fmCKBbju0uPme19UHJpW9FbzbyxurKgVwgnKOQZCvzuN1Dnkga5B2Pdnn7d2quo1dZ54kKMQuX_g2apkXoN5cTcaxBKvrJB3K4TRLcsXA';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [dishes, setDishes] = useState<DishItem[]>(INITIAL_DISHES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Login Form States
  const [authMethod, setAuthMethod] = useState<AuthMethod>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Add New Dish Form States
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<CategoryType>('Mains');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishImage, setNewDishImage] = useState<string | null>(null);

  // Splash Screen Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('welcome');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Cart Operations
  const addToCart = (dish: DishItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1, imageUrl: dish.imageUrl }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Popular'
        ? dish.isPopular
        : dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLoginSubmit = () => {
    if (authMethod === 'username') {
      if (!username.trim() || !password.trim()) {
        Alert.alert('Required', 'Please enter both username/email and password.');
        return;
      }
    } else {
      if (!phoneNumber.trim() || phoneNumber.length < 8) {
        Alert.alert('Required', 'Please enter a valid phone number.');
        return;
      }
    }
    setCurrentScreen('menu');
  };

  const handleSaveDish = () => {
    if (!newDishName.trim()) {
      Alert.alert('Missing Field', 'Please enter a dish name.');
      return;
    }
    if (!newDishPrice.trim() || isNaN(Number(newDishPrice))) {
      Alert.alert('Invalid Price', 'Please enter a valid numeric price.');
      return;
    }

    const createdDish: DishItem = {
      id: Date.now().toString(),
      name: newDishName,
      description: newDishDesc || 'Freshly prepared delicious item.',
      category: newDishCategory,
      price: parseFloat(newDishPrice),
      rating: 5.0,
      prepTime: '15-20 min',
      calories: '500 kcal',
      imageUrl:
        newDishImage ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    };

    setDishes([createdDish, ...dishes]);
    Alert.alert('Success', 'New dish added to live menu!');

    // Reset Form
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    setNewDishImage(null);
    setCurrentScreen('menu');
  };

  // Bottom Navigation Bar
  const renderBottomNav = () => (
    <View style={styles.bottomNavContainer}>
      <TouchableOpacity style={styles.navTab} onPress={() => setCurrentScreen('menu')}>
        <Text style={[styles.navIcon, currentScreen === 'menu' && styles.navActiveText]}>🏠</Text>
        <Text style={[styles.navLabel, currentScreen === 'menu' && styles.navActiveText]}>Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab} onPress={() => setCurrentScreen('add-dish')}>
        <Text style={[styles.navIcon, currentScreen === 'add-dish' && styles.navActiveText]}>➕</Text>
        <Text style={[styles.navLabel, currentScreen === 'add-dish' && styles.navActiveText]}>Add Dish</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab} onPress={() => setCurrentScreen('about')}>
        <Text style={[styles.navIcon, currentScreen === 'about' && styles.navActiveText]}>ℹ️</Text>
        <Text style={[styles.navLabel, currentScreen === 'about' && styles.navActiveText]}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab} onPress={() => setCurrentScreen('cart')}>
        <View>
          <Text style={[styles.navIcon, currentScreen === 'cart' && styles.navActiveText]}>🛒</Text>
          {cartItemCount > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navLabel, currentScreen === 'cart' && styles.navActiveText]}>Cart</Text>
      </TouchableOpacity>
    </View>
  );

  // 1. SPLASH SCREEN
  if (currentScreen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.splashGlowBadge}>
          <Text style={styles.splashEmoji}>👨‍🍳</Text>
        </View>
        <Text style={styles.splashTitle}>CHEF'S TABLE</Text>
        <Text style={styles.splashTagline}>Gourmet Meals Delivered Fresh</Text>
        <ActivityIndicator size="large" color="#FF5A5F" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        {/* 2. WELCOME / SIGN IN CHOICE */}
        {currentScreen === 'welcome' && (
          <ScrollView contentContainerStyle={styles.welcomeContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' }}
              style={styles.heroImage}
            />
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeBadge}>WELCOME TO CHEF'S TABLE</Text>
              <Text style={styles.welcomeTitle}>Delicious Food Made Simple</Text>
              <Text style={styles.welcomeSub}>Order fresh gourmet creations directly to your table or doorstep.</Text>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setCurrentScreen('login')}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>Sign In / Register</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.guestBtn} onPress={() => setCurrentScreen('menu')}>
                <Text style={styles.guestBtnText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 3. LOGIN SCREEN */}
        {currentScreen === 'login' && (
          <ScrollView contentContainerStyle={styles.loginContainer}>
            <TouchableOpacity style={styles.loginBackBtn} onPress={() => setCurrentScreen('welcome')}>
              <Text style={styles.loginBackText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.loginHeaderTitle}>Sign In to Chef's Table</Text>
            <Text style={styles.loginHeaderSub}>Choose your preferred way to sign in</Text>

            <View style={styles.authToggleBar}>
              <TouchableOpacity
                style={[styles.authToggleTab, authMethod === 'username' && styles.authToggleActive]}
                onPress={() => setAuthMethod('username')}
              >
                <Text style={[styles.authToggleText, authMethod === 'username' && styles.authToggleActiveText]}>
                  Username
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.authToggleTab, authMethod === 'phone' && styles.authToggleActive]}
                onPress={() => setAuthMethod('phone')}
              >
                <Text style={[styles.authToggleText, authMethod === 'phone' && styles.authToggleActiveText]}>
                  Phone Number
                </Text>
              </TouchableOpacity>
            </View>

            {authMethod === 'username' ? (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Username or Email</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. chef_john or john@example.com"
                  placeholderTextColor="#A0A0A0"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. +1 555 123 4567"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <Text style={styles.fieldHint}>We will send an SMS code to verify your phone number.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLoginSubmit}>
              <Text style={styles.primaryBtnText}>
                {authMethod === 'username' ? 'Sign In' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* 4. MENU / HOME SCREEN */}
        {currentScreen === 'menu' && (
          <View style={{ flex: 1 }}>
            <View style={styles.menuHeader}>
              <View>
                <Text style={styles.greetingText}>Chef's Table 👋</Text>
                <Text style={styles.locationText}>📍 Delivering to <Text style={styles.locationBold}>Downtown, Ave 4</Text></Text>
              </View>
              <TouchableOpacity style={styles.profileBtn} onPress={() => setCurrentScreen('welcome')}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search dishes, desserts, starters..."
                placeholderTextColor="#9E9E9E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.imageBannerContainer}>
                <Image source={{ uri: CUSTOM_BANNER_URL }} style={styles.imageBanner} resizeMode="cover" />
                <View style={styles.imageBannerOverlay}>
                  <Text style={styles.promoTag}>SPECIAL PROMO</Text>
                  <Text style={styles.promoTitle}>20% OFF FIRST ORDER</Text>
                  <Text style={styles.promoCode}>Use code: CHEF20</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesBar}>
                {(['All', 'Popular', 'Mains', 'Starters', 'Desserts'] as CategoryType[]).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, selectedCategory === cat && styles.activeCategoryChip]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.categoryChipText, selectedCategory === cat && styles.activeCategoryText]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.foodListContent}>
                {filteredDishes.map((dish) => (
                  <TouchableOpacity
                    key={dish.id}
                    style={styles.customerDishCard}
                    onPress={() => {
                      setSelectedDish(dish);
                      setCurrentScreen('dish-detail');
                    }}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: dish.imageUrl }} style={styles.cardImage} />

                    {dish.isPopular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>🔥 Popular</Text>
                      </View>
                    )}

                    <View style={styles.cardInfo}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.dishTitle}>{dish.name}</Text>
                        <View style={styles.ratingBox}>
                          <Text style={styles.starIcon}>⭐</Text>
                          <Text style={styles.ratingText}>{dish.rating}</Text>
                        </View>
                      </View>

                      <Text style={styles.dishDescription} numberOfLines={2}>
                        {dish.description}
                      </Text>

                      <View style={styles.cardFooter}>
                        <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
                        <TouchableOpacity
                          style={styles.addCartBtn}
                          onPress={() => addToCart(dish)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.addCartBtnText}>+ Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* 5. ADD NEW DISH SCREEN (Matched to Image) */}
        {currentScreen === 'add-dish' && (
          <ScrollView contentContainerStyle={styles.addDishContainer}>
            <View style={styles.addDishHeader}>
              <TouchableOpacity style={styles.backCircleBtn} onPress={() => setCurrentScreen('menu')}>
                <Text style={styles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.addDishHeaderTitle}>Add New Dish</Text>
            </View>

            {/* Upload Box */}
            <TouchableOpacity
              style={styles.uploadArea}
              onPress={() => {
                setNewDishImage(
                  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
                );
                Alert.alert('Image Selected', 'Sample dish image selected!');
              }}
            >
              {newDishImage ? (
                <Image source={{ uri: newDishImage }} style={styles.uploadedPreview} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>🖼️</Text>
                  <Text style={styles.uploadTitle}>Upload Dish Image</Text>
                  <Text style={styles.uploadSub}>High-quality plating style preferred</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Dish Name Input */}
            <Text style={styles.greenInputLabel}>Dish Name</Text>
            <TextInput
              style={styles.roundedInput}
              placeholder="e.g. Crispy Skin Sea Bass"
              placeholderTextColor="#B0B0B0"
              value={newDishName}
              onChangeText={setNewDishName}
            />

            {/* Description Input */}
            <Text style={styles.greenInputLabel}>Description</Text>
            <TextInput
              style={[styles.roundedInput, styles.multilineInput]}
              placeholder="e.g. Describe presentation, key flavor profiles, garnishes, and major dietary notes..."
              placeholderTextColor="#B0B0B0"
              multiline
              numberOfLines={4}
              value={newDishDesc}
              onChangeText={setNewDishDesc}
            />

            {/* Course Category & Price Row */}
            <View style={styles.rowInputs}>
              <View style={{ flex: 1.4, marginRight: 10 }}>
                <Text style={styles.greenInputLabel}>Course Category</Text>
                <View style={styles.dropdownBox}>
                  <Text style={styles.dropdownText}>🟢 {newDishCategory}</Text>
                  <Text style={{ color: '#666' }}>▼</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.greenInputLabel}>Price ($)</Text>
                <TextInput
                  style={styles.roundedInput}
                  placeholder="$ 34.00"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                  value={newDishPrice}
                  onChangeText={setNewDishPrice}
                />
              </View>
            </View>

            {/* Green Save Button */}
            <TouchableOpacity style={styles.oliveGreenBtn} onPress={handleSaveDish}>
              <Text style={styles.oliveGreenBtnText}>Save Dish to Live Menu</Text>
            </TouchableOpacity>

            <View style={styles.bottomBarIndicator} />
          </ScrollView>
        )}

        {/* 6. ABOUT SCREEN */}
        {currentScreen === 'about' && (
          <ScrollView contentContainerStyle={styles.aboutContainer}>
            <Image source={{ uri: CUSTOM_BANNER_URL }} style={styles.aboutBannerImage} />
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>About Chef's Table</Text>
              <Text style={styles.aboutText}>
                Chef's Table is dedicated to providing high-quality, chef-crafted meals made from fresh, locally-sourced ingredients. Whether you are craving starters, high-grade steak mains, or mouth-watering desserts, we deliver fine dining directly to your door.
              </Text>

              <View style={styles.aboutInfoBox}>
                <Text style={styles.aboutInfoTitle}>🕒 Operating Hours</Text>
                <Text style={styles.aboutInfoSub}>Monday - Sunday: 10:00 AM - 10:00 PM</Text>
              </View>

              <View style={styles.aboutInfoBox}>
                <Text style={styles.aboutInfoTitle}>📞 Contact Support</Text>
                <Text style={styles.aboutInfoSub}>Email: support@chefstable.com</Text>
                <Text style={styles.aboutInfoSub}>Phone: +1 (800) 555-CHEF</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* 7. DISH DETAIL VIEW */}
        {currentScreen === 'dish-detail' && selectedDish && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.detailImageContainer}>
                <Image source={{ uri: selectedDish.imageUrl }} style={styles.detailImage} />
                <TouchableOpacity style={styles.detailBackBtn} onPress={() => setCurrentScreen('menu')}>
                  <Text style={styles.detailBackText}>←</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailBody}>
                <View style={styles.detailTitleRow}>
                  <Text style={styles.detailTitle}>{selectedDish.name}</Text>
                  <Text style={styles.detailPrice}>${selectedDish.price.toFixed(2)}</Text>
                </View>

                <View style={styles.detailMetaRow}>
                  <View style={styles.detailMetaChip}>
                    <Text style={styles.detailMetaText}>⭐ {selectedDish.rating}</Text>
                  </View>
                  <View style={styles.detailMetaChip}>
                    <Text style={styles.detailMetaText}>⏱ {selectedDish.prepTime}</Text>
                  </View>
                  <View style={styles.detailMetaChip}>
                    <Text style={styles.detailMetaText}>🔥 {selectedDish.calories}</Text>
                  </View>
                </View>

                <Text style={styles.detailSectionTitle}>Description</Text>
                <Text style={styles.detailDescription}>{selectedDish.description}</Text>
              </View>
            </ScrollView>

            <View style={styles.detailFooter}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  addToCart(selectedDish);
                  setCurrentScreen('menu');
                }}
              >
                <Text style={styles.primaryBtnText}>Add to Order • ${(selectedDish.price).toFixed(2)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 8. CART SCREEN */}
        {currentScreen === 'cart' && (
          <View style={{ flex: 1 }}>
            <View style={styles.cartHeader}>
              <TouchableOpacity style={styles.backCircleBtn} onPress={() => setCurrentScreen('menu')}>
                <Text style={styles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.cartHeaderTitle}>Your Order</Text>
            </View>

            <ScrollView contentContainerStyle={styles.cartListContent}>
              {cart.length === 0 ? (
                <View style={styles.emptyCartBox}>
                  <Text style={{ fontSize: 40, marginBottom: 10 }}>🛒</Text>
                  <Text style={{ fontSize: 16, color: '#666' }}>Your cart is empty.</Text>
                </View>
              ) : (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartItemCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.cartItemThumb} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                    <View style={styles.qtyControl}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.id, -1)}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.id, 1)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}

              {cart.length > 0 && (
                <View style={styles.checkoutSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryVal}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryVal}>$2.99</Text>
                  </View>
                  <View style={[styles.summaryRow, { marginTop: 8 }]}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalVal}>${(cartTotal + 2.99).toFixed(2)}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {
                    Alert.alert('Order Received!', 'Your food is being prepared by Chef\'s Table.', [
                      {
                        text: 'Awesome',
                        onPress: () => {
                          setCart([]);
                          setCurrentScreen('menu');
                        },
                      },
                    ]);
                  }}
                >
                  <Text style={styles.primaryBtnText}>Place Order • ${(cartTotal + 2.99).toFixed(2)}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        {currentScreen && currentScreen !== 'welcome' && currentScreen !== 'login' && renderBottomNav()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },

  // Splash
  splashContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashGlowBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
  },
  splashEmoji: {
    fontSize: 36,
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  splashTagline: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 6,
  },

  // Welcome
  welcomeContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  welcomeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: 'center',
  },
  welcomeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF5A5F',
    letterSpacing: 1.5,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 8,
  },
  welcomeSub: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  // Login Screen
  loginContainer: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  loginBackBtn: {
    marginBottom: 20,
  },
  loginBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  loginHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  loginHeaderSub: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
    marginBottom: 24,
  },
  authToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  authToggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  authToggleActive: {
    backgroundColor: '#FFFFFF',
  },
  authToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  authToggleActiveText: {
    color: '#1A1A1A',
    fontWeight: '800',
  },
  formGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    marginTop: 10,
  },
  formInput: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  fieldHint: {
    fontSize: 11,
    color: '#888888',
    marginTop: 6,
  },

  // Add Dish Screen Styles (From Screenshot)
  addDishContainer: {
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  addDishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addDishHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#1A1A1A',
  },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#8A9A86',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F3F5F2',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadedPreview: {
    width: '100%',
    height: '100%',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B4839',
  },
  uploadSub: {
    fontSize: 11,
    color: '#778875',
    marginTop: 4,
  },
  greenInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C352B',
    marginBottom: 6,
    marginTop: 10,
  },
  roundedInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1A1A1A',
  },
  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C352B',
  },
  oliveGreenBtn: {
    backgroundColor: '#495B3E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  oliveGreenBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomBarIndicator: {
    width: 120,
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 24,
  },

  // Common Buttons
  primaryBtn: {
    backgroundColor: '#FF5A5F',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  guestBtn: {
    marginTop: 16,
  },
  guestBtnText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '600',
  },

  // Menu Header
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  locationBold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  profileBtn: {
    padding: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },

  // Image Banner
  imageBannerContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 140,
    position: 'relative',
    marginBottom: 14,
  },
  imageBanner: {
    width: '100%',
    height: '100%',
  },
  imageBannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
    justifyContent: 'center',
  },
  promoTag: {
    color: '#FF5A5F',
    fontSize: 11,
    fontWeight: '800',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  promoCode: {
    color: '#E0E0E0',
    fontSize: 12,
    marginTop: 4,
  },

  // Categories
  categoriesBar: {
    paddingLeft: 20,
    marginBottom: 14,
    maxHeight: 40,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#FF5A5F',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },

  // Food List Card
  foodListContent: {
    paddingHorizontal: 20,
  },
  customerDishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardInfo: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  dishDescription: {
    fontSize: 12,
    color: '#777777',
    marginTop: 6,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  addCartBtn: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // About Screen
  aboutContainer: {
    paddingBottom: 20,
  },
  aboutBannerImage: {
    width: '100%',
    height: 200,
  },
  aboutContent: {
    padding: 20,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutInfoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  aboutInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  aboutInfoSub: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },

  // Detail View
  detailImageContainer: {
    height: 280,
    width: '100%',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailBackBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBackText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  detailBody: {
    padding: 20,
  },
  detailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    flex: 1,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF5A5F',
  },
  detailMetaRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  detailMetaChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  detailMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  detailFooter: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },

  // Cart Screen
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backCircleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cartHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  cartListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyCartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cartItemThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cartItemPrice: {
    fontSize: 13,
    color: '#FF5A5F',
    fontWeight: '700',
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    paddingHorizontal: 6,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  checkoutSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666666',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  summaryTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF5A5F',
  },
  cartFooter: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },

  // Bottom Navigation Bar
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingVertical: 10,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    color: '#888888',
  },
  navLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
    marginTop: 2,
  },
  navActiveText: {
    color: '#495B3E',
    fontWeight: '800',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});