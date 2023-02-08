import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PDFViewer, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
const apirUrl = "http://localhost:4000/pdf/1";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const MyDocument = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text>Section #1</Text>
    </View>
    <View style={styles.section}>
      <Text>Section #2</Text>
    </View>
  </Page>
);

function App() {
  const [chunkedData, setChunkedData] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const downloadLink = useRef<HTMLAnchorElement | null>(null);

  const [pdf, setPdf] = useState("");
  const binaryData = chunkedData ? atob(chunkedData) : "";

  // binary view of decoded data
  const binaryView = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    binaryView[i] = binaryData.charCodeAt(i);
  }

  // blob object from binary view
  const blob = new Blob([binaryView], { type: "application/pdf" });

  buttonRef.current?.addEventListener("click", () => {
    if (downloadLink.current === null) return null;
    downloadLink.current.href = URL.createObjectURL(blob);
    downloadLink.current.download = "document.pdf";
    downloadLink.current.click();
  });

  const getDocument = async (): Promise<void> => {
    // const response = await axios.get(apirUrl, { responseType: "blob" });
    const response = await axios.get(apirUrl);
    setChunkedData(response.data);
  };

  useEffect(() => {
    console.log("chunkedData", chunkedData);
    getDocument();
  }, [chunkedData]);
  return (
    <div className="App">
      <h1>Get chuked data</h1>
      <a ref={downloadLink}></a>
      <button ref={buttonRef} onClick={() => getDocument()}>
        Get Document 1
      </button>

      {/* <MyDocument /> */}
    </div>
  );
}

export default App;
