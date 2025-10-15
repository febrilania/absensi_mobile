// import api from "@/src/api/api";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Image,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Home() {
//   const [showMenu, setShowMenu] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // animasi header dan konten
//   const headerAnim = useRef(new Animated.Value(-150)).current;
//   const listAnim = useRef(new Animated.Value(0)).current;

//   const playAnimations = useCallback(() => {
//     headerAnim.setValue(-150);
//     listAnim.setValue(0);

//     Animated.timing(headerAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();

//     Animated.timing(listAnim, {
//       toValue: 1,
//       duration: 600,
//       delay: 200,
//       useNativeDriver: true,
//     }).start();
//   }, [headerAnim, listAnim]);

//   useFocusEffect(
//     useCallback(() => {
//       playAnimations();
//     }, [playAnimations])
//   );

//   const getUserData = async () => {
//     try {
//       setLoading(true);
//       const token = await SecureStore.getItemAsync("token");

//       if (!token) {
//         Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
//         setLoading(false);
//         router.replace("/");
//         return;
//       }

//       const response = await api.get("/me", {
//         headers: {
//           XAuthorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data?.user) {
//         setUser(response.data.user);
//       } else {
//         Alert.alert(
//           "Gagal",
//           response.data?.message || "Data user tidak ditemukan."
//         );
//       }
//     } catch (error: any) {
//       Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);

//   const handleLogout = async () => {
//     await SecureStore.deleteItemAsync("token");
//     Alert.alert("Logout", "Berhasil logout!");
//     setShowMenu(false);
//     router.replace("/");
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header animasi */}
//       <Animated.View
//         style={[
//           styles.header,
//           {
//             transform: [{ translateY: headerAnim }],
//           },
//         ]}
//       >
//         <Image
//           source={require("../../assets/images/peradaban.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>Data Pengguna</Text>

//         <Pressable
//           onPress={() => setShowMenu(!showMenu)}
//           style={styles.menuButton}
//         >
//           <Ionicons name="ellipsis-vertical" size={24} color="white" />
//         </Pressable>

//         {showMenu && (
//           <View style={styles.dropdown}>
//             <TouchableOpacity
//               onPress={handleLogout}
//               style={styles.dropdownItem}
//             >
//               <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
//               <Text style={styles.dropdownText}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Animated.View>

//       {/* 🔹 Tambahkan ScrollView di sini */}
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View
//           style={[
//             styles.content,
//             {
//               opacity: listAnim,
//               transform: [
//                 {
//                   translateY: listAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [50, 0],
//                   }),
//                 },
//               ],
//             },
//           ]}
//         >
//           {loading ? (
//             <ActivityIndicator size="large" color="#1E90FF" />
//           ) : user ? (
//             <>
//               <View style={styles.photoWrapper}>
//                 <Image
//                   source={{
//                     uri: user.foto
//                       ? user.foto
//                       : "https://sim.peradaban.ac.id/wp-content/uploads/mhs/data/default.png",
//                   }}
//                   style={styles.photo}
//                   resizeMode="cover"
//                 />
//               </View>

//               <Text style={styles.label}>Nama Lengkap</Text>
//               <Text style={styles.value}>{user.nama}</Text>

//               <Text style={styles.label}>Username</Text>
//               <Text style={styles.value}>{user.username}</Text>

//               <Text style={styles.label}>Email</Text>
//               <Text style={styles.value}>{user.email}</Text>

//               <Text style={styles.label}>No HP</Text>
//               <Text style={styles.value}>{user.hp}</Text>
//               <Text style={styles.label}>No HP</Text>
//               <Text style={styles.value}>{user.hp}</Text>
//               <Text style={styles.label}>No HP</Text>
//               <Text style={styles.value}>{user.hp}</Text>
//             </>
//           ) : (
//             <Text style={{ textAlign: "center", color: "#555" }}>
//               Data tidak tersedia.
//             </Text>
//           )}
//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom: 40 },
//   header: {
//     backgroundColor: "#1E90FF",
//     paddingTop: 60,
//     paddingBottom: 20,
//     alignItems: "center",
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     elevation: 5,
//   },
//   logo: { width: "40%", height: 90, marginBottom: 5 },
//   title: { fontSize: 22, fontWeight: "bold", color: "white" },
//   menuButton: { position: "absolute", right: 20, top: 70, padding: 5 },
//   dropdown: {
//     position: "absolute",
//     right: 15,
//     top: 100,
//     backgroundColor: "white",
//     borderRadius: 8,
//     elevation: 5,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   dropdownText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: "#1E90FF",
//     fontWeight: "600",
//   },
//   content: { flex: 1, padding: 20 },
//   photoWrapper: {
//     alignItems: "center",
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   photo: {
//     width: 150,
//     height: 200,
//     borderRadius: 30,
//     borderWidth: 3,
//     borderColor: "#1E90FF",
//     backgroundColor: "#eee",
//   },
//   label: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 5,
//     marginTop: 12,
//     fontWeight: "600",
//   },
//   value: {
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#1E90FF",
//     paddingVertical: 8,
//     fontSize: 16,
//     color: "#000",
//   },
// });
import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // animasi header dan konten
  const headerAnim = useRef(new Animated.Value(-150)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const playAnimations = useCallback(() => {
    headerAnim.setValue(-150);
    listAnim.setValue(0);

    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(listAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [headerAnim, listAnim]);

  useFocusEffect(
    useCallback(() => {
      playAnimations();
    }, [playAnimations])
  );

  const getUserData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
        setLoading(false);
        router.replace("/");
        return;
      }

      const response = await api.get("/me", {
        headers: {
          XAuthorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        Alert.alert(
          "Gagal",
          response.data?.message || "Data user tidak ditemukan."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header animasi */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Data Pengguna</Text>

          <Pressable
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuButton}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </Pressable>
        </View>

        {showMenu && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.dropdownItem}
            >
              <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* 🔹 ScrollView konten */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: listAnim,
              transform: [
                {
                  translateY: listAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : user ? (
            <>
              <View style={styles.photoWrapper}>
                <Image
                  source={{
                    uri: user.foto
                      ? user.foto
                      : "https://sim.peradaban.ac.id/wp-content/uploads/mhs/data/default.png",
                  }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.label}>Nama Lengkap</Text>
              <Text style={styles.value}>{user.nama}</Text>

              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{user.username}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>

              <Text style={styles.label}>No HP</Text>
              <Text style={styles.value}>{user.hp}</Text>
            </>
          ) : (
            <Text style={{ textAlign: "center", color: "#555" }}>
              Data tidak tersedia.
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom: 40 },
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "relative", // tambahkan ini
    zIndex: 999, // tambahkan ini
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "white" },
  menuButton: { padding: 5 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 85,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 8,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
  },
  content: { flex: 1, padding: 20 },
  photoWrapper: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  photo: {
    width: 150,
    height: 200,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#1E90FF",
    backgroundColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    marginTop: 12,
    fontWeight: "600",
  },
  value: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1E90FF",
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },
});
