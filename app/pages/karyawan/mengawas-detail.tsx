import Header from "@/components/header";
import ListMhs from "@/components/listMhs";
import MengawasActionButtons from "@/components/mengawasAB";
import MengawasCatatan from "@/components/mengawasCatatan";
import MengawasInfoBox from "@/components/mengawasInfobox";
import { useMengawasDetail } from "@/hooks/mengawasDetail";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function MengawasDetail() {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const parsed = JSON.parse(data as string);

  const {
    mahasiswa,
    catatan,
    setCatatan,
    handleAbsen,
    handleGenerateAll,
    handleSelesaiUjian,
    handleSimpanCatatan,
    loading,
    savingCatatan,
    finishing,
    isSelesai,
  } = useMengawasDetail(parsed, router);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Header title="Detail Mengawas" showBack />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          >
            <MengawasInfoBox data={parsed} isSelesai={isSelesai} />
            <MengawasCatatan
              catatan={catatan}
              setCatatan={setCatatan}
              isSelesai={isSelesai}
              savingCatatan={savingCatatan}
              onSave={handleSimpanCatatan}
            />
            <MengawasActionButtons
              isSelesai={isSelesai}
              loading={loading}
              finishing={finishing}
              onGenerate={handleGenerateAll}
              onFinish={handleSelesaiUjian}
            />
            <ListMhs
              data={mahasiswa}
              onAbsen={handleAbsen}
              loading={loading}
              isSelesai={isSelesai}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
});
