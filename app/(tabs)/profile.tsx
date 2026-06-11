import MText from "@/components/common/text";
import { Alert, StatusBar, TouchableOpacity, useColorScheme, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuth, logout } from "../store/slices/authSlice";
import MCard from "@/components/common/card";
import { Image } from "expo-image";
import MGap from "@/components/common/gap";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeText = isDark ? '#F3F4F6' : '#11181C';
  const dispatch = useAppDispatch();
  const themeBg = isDark ? '#000000' : '#FFFFFF';


  const { user } = useAppSelector((state) => state.auth);
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Anonym';
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(clearAuth());
            dispatch(logout());
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MCard style={[styles.header, { padding: 0, borderRadius: 0 }]}>
        <MText text="User Profile" size={24} weight="800" color={themeText} />
      </MCard>

      <MCard style={[styles.content, { margin: 16, borderRadius: 0 }]}>
        <MCard style={[styles.card, { backgroundColor: themeBg, borderColor: themeText }]}>
          <Image
            source={{ uri: user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
            style={[styles.avatar, { borderColor: themeText }]}
            contentFit="cover"
            transition={200}
          />
          <MGap size={16} />
          <MText text={fullName} size={20} weight="800" color={themeText} />
          <MGap size={4} />
          <MText text={`@${user?.username || 'username'}`} size={14} weight="700" color={themeText} style={{ textTransform: 'lowercase', opacity: 0.8 }} />

          <MCard style={[styles.detailRow, { padding: 0, borderRadius: 0 }]}>
            <MaterialIcons name="email" size={20} color={themeText} style={{ marginRight: 16 }} />
            <MCard style={{ padding: 0, borderRadius: 0 }}>
              <MText text="Email Address" size={11} weight="600" color={themeText} style={{ textTransform: 'uppercase', opacity: 0.6 }} />
              <MGap size={2} />
              <MText text={user?.email || 'user@example.com'} size={15} weight="600" color={themeText} />
            </MCard>
          </MCard>

          <MGap size={16} />

          {user?.gender && (
            // <MCard style={{ padding: 0, borderRadius: 0 }}>
            <MCard style={[styles.detailRow, { padding: 0, borderRadius: 0 }]}>
              <MaterialIcons name="face" size={20} color={themeText} style={{ marginRight: 16 }} />
              <MCard style={{ padding: 0, borderRadius: 0 }}>
                <MText text="Gender" size={11} weight="600" color={themeText} style={{ textTransform: 'uppercase', opacity: 0.6 }} />
                <MGap size={2} />
                <MText text={user.gender} size={15} weight="600" color={themeText} style={{ textTransform: 'capitalize' }} />
              </MCard>
            </MCard>
            // </MCard>
          )}
        </MCard>
        <MGap size={24} />

        <MCard style={{ padding: 0, borderRadius: 0 }}>
          <MGap size={12} />
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: themeText }]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color={themeBg} style={{ marginRight: 8 }} />
            <MText text="Log Out" size={16} weight="700" color={themeBg} />
          </TouchableOpacity>
        </MCard>
      </MCard>
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.2,
  },
  detailRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
