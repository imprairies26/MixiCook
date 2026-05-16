import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';

export default function PostRecipeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ id: 1, name: '', amount: '' }]);
  const [steps, setSteps] = useState([{ id: 1, desc: '' }]);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', amount: '' }]);
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), desc: '' }]);
  };

  const handlePost = () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
      return;
    }
    Alert.alert('Thành công!', 'Công thức của bạn đã được đăng tải và sẽ hiển thị sau khi duyệt.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chia sẻ công thức" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imageUpload} activeOpacity={0.7}>
           <View style={styles.cameraCircle}>
            <Feather name="camera" size={32} color={COLORS.primary} />
           </View>
           <Text style={styles.uploadText}>Thêm ảnh bìa món ăn</Text>
           <Text style={styles.uploadSubtext}>Ảnh đẹp sẽ thu hút nhiều người xem hơn!</Text>
        </TouchableOpacity>

        <View style={styles.formSection}>
          <Text style={styles.label}>Tên món ăn</Text>
          <Input 
            placeholder="VD: Cơm rang dưa bò..."
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.row}>
            <View style={{flex: 1.2}}>
              <Text style={styles.label}>Thời gian (phút)</Text>
              <Input placeholder="30" keyboardType="numeric" icon="clock" />
            </View>
            <View style={{width: 16}} />
            <View style={{flex: 1}}>
              <Text style={styles.label}>Độ khó</Text>
              <TouchableOpacity style={styles.dropdown}>
                 <Text style={{color: COLORS.text}}>Trung bình</Text>
                 <Feather name="chevron-down" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Nguyên liệu</Text>
            <TouchableOpacity onPress={addIngredient}>
              <Text style={styles.addBtn}>+ Thêm</Text>
            </TouchableOpacity>
          </View>
          
          {ingredients.map((ing, idx) => (
            <View key={ing.id} style={styles.ingredientInputRow}>
              <TextInput 
                placeholder="Tên nguyên liệu" 
                style={[styles.inputBase, { flex: 2 }]} 
                placeholderTextColor={COLORS.textMuted}
                value={ing.name}
                onChangeText={(text) =>
                  setIngredients(ingredients.map(i =>
                    i.id === ing.id ? { ...i, name: text } : i
                  ))
                }
              />
              <TextInput 
                placeholder="Lượng" 
                style={[styles.inputBase, { flex: 1 }]} 
                placeholderTextColor={COLORS.textMuted}
                value={ing.amount}
                onChangeText={(text) =>
                  setIngredients(ingredients.map(i =>
                    i.id === ing.id ? { ...i, amount: text } : i
                  ))
                }
              />
              {ingredients.length > 1 && (
                <TouchableOpacity onPress={() => setIngredients(ingredients.filter(i => i.id !== ing.id))}>
                  <Feather name="trash-2" size={18} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Các bước thực hiện</Text>
            <TouchableOpacity onPress={addStep}>
              <Text style={styles.addBtn}>+ Thêm bước</Text>
            </TouchableOpacity>
          </View>

          {steps.map((step, idx) => (
            <View key={step.id} style={styles.stepBox}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{idx + 1}</Text>
                </View>
                {steps.length > 1 && (
                  <TouchableOpacity onPress={() => setSteps(steps.filter(s => s.id !== step.id))}>
                    <Feather name="x" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput 
                placeholder={`Mô tả chi tiết bước ${idx + 1}...`}
                multiline
                style={styles.stepInput}
                placeholderTextColor={COLORS.textMuted}
                value={step.desc}
                onChangeText={(text) =>
                  setSteps(steps.map(s =>
                    s.id === step.id ? { ...s, desc: text } : s
                  ))
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: Math.max(insets.bottom, 0) + 80 }]}>
        <View style={{ flex: 1 }}>
          <Button title="Lưu nháp" variant="outline" />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Đăng ngay" onPress={handlePost} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 24,
    paddingBottom: 200,
  },
  imageUpload: {
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    ...TYPOGRAPHY.h2,
    fontSize: 16,
    color: COLORS.text,
  },
  uploadSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  formSection: {
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.h2,
    fontSize: 17,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredientInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  inputBase: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    color: COLORS.text,
    ...TYPOGRAPHY.bodySmall,
  },
  stepBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  stepInput: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    position: 'absolute',
    left: 0,
    right: 0,
  }
});
