import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Modal
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const borderBottomWidth = useSharedValue(1);
  const borderColor = useSharedValue('#939393');

  const textInputStyles = useAnimatedStyle(() => {
    return {
      borderBottomWidth: borderBottomWidth.value,
      borderBottomColor: borderColor.value,
    };
  });

  const animateBorder = (focused) => {
    borderBottomWidth.value = withTiming(focused ? 2 : 1, {
      duration: 75,
      easing: Easing.ease,
    });
    borderColor.value = focused ? 'blue' : '#939393';
  };

  const handleFocus = () => {
    animateBorder(true);
  };

  const handleBlur = () => {
    animateBorder(false);
  };

  const forgetPassword = async () => {
    const data = JSON.stringify({
      email: email
    });

    await axios.post("http://192.168.136.158:3004/verifyEmailRecover", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
        setInfo(response.data);
        navigation.navigate("VerifyEmail", { email: email, role: 'recover' });

    }).catch(error => {
      setInfo(error.response.data);
    });
  };
  
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };
  
  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-reactivate" style={styles.recoverIcon} />
            <Text style={styles.titleHeader}>Recupera tu cuenta</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.textInput,
                  textInputStyles,
                  styles.textInputEmail,
                ]}
              >
                <TextInput
                  placeholder="Introduce tu correo"
                  value={email}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(text) => setEmail(text)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              forgetPassword();
            }}
          >
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <View style={styles.signupContainer}>
              <Text>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.linkText}>
                  Autentícate aquí
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsModalVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalInfoOut}
              activeOpacity={1}
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalInfo}
                activeOpacity={1}
              >
                <Text style={styles.modalInfoTextHeader}>{infoModal}</Text>
                <View style={styles.containerModalInfoButton}> 
                  <TouchableOpacity 
                    style={styles.modalInfoButton}
                    onPress={() => {
                      setIsModalVisible(false);
                    }}
                  >
                    <Text>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoverIcon: {
    fontSize: 48,
    color: 'black',
    marginBottom: 35,
  },
  titleHeader: {
    color: 'black',
    fontWeight: '500',
  },
  textInput: {
    marginBottom: 20,
  },
  textInputEmail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    down: 0,
  },
  textInputContainer: {
    marginTop: 35,
    height: 50,
  },
  button: {
    marginTop: 35,
    backgroundColor: '#3366FF',
    borderRadius: 7,
    paddingVertical: 13,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
  },
  linkText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  textContainer: {
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfoOut: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin:20,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalInfoTextHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerModalInfoButton: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 25,
  },
  modalInfoButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});