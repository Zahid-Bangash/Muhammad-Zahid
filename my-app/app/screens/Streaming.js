// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Camera } from "expo-camera";

// export default function GoLive() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.cameraPreview} type={cameraType} />
//       <TouchableOpacity
//         style={styles.cameraButton}
//         onPress={() =>
//           setCameraType(
//             cameraType === Camera.Constants.Type.back
//               ? Camera.Constants.Type.front
//               : Camera.Constants.Type.back
//           )
//         }
//       >
//         <Text style={styles.cameraButtonText}>Switch Camera</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cameraPreview: {
//     width: "100%",
//     height: "80%",
//   },
//   cameraButton: {
//     backgroundColor: "#ff4d4d",
//     padding: 10,
//     borderRadius: 5,
//     margin: 20,
//   },
//   cameraButtonText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function GoLive() {
  return (
    <WebView
      style={styles.container}
      source={{
        uri: "https://web.facebook.com/groups/1704455179987177",
      }}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
