import {Dimensions, StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, FlatList, Image, Button, Linking, SafeAreaView, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useState, useEffect, useCallback} from 'react';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';
import MapView from 'react-native-maps';
// const axios = require("axios");
import axios from 'axios';
// import React, {useCallback} from 'react';



export default function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [dataRender, setRender] = useState(null);
  const [items, setItems] = useState([
    {label: 'loading...', value: null}
  ]);

  const [fetchedState,setFetchedState]=useState(null);
  const [dataKelurahan, setDataKelurahan] = useState();
  const [statusKelurahan, setStatusKelurahan] = useState(true);

  const [region,setRegion] = useState({
      latitude: -3.9934610114158393,
      longitude: 122.51298174434778,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0322,
 })



  // Mengambil titik koordinat

  const [datalocation, setLocation] = useState(null);
  useEffect(() => {
    try{
      (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("Titik Koordinat OK!!")
    })();
    }catch {
      console.error("Multiple fetch failed 1"); // Error message logs to console
    }
    
  }, []);

 
  //akhir mengambil titik koordinat


 // mulai makerequest 1
  const [statusReq1, setReq1] = useState(true);
    async function makeRequests1() {
      console.log("makerequest 1")
      try{
          const response = await fetch("http://103.37.124.94:1337/api/kelurahans?pagination[pageSize]=100&fields[0]=nama_kelurahan");
          const data = await response.json();
          // console.log(data.data);
          arr_data_obj_kelurahan = []
          for (let i in data.data){
            data_obj = {label: data.data[i].attributes.nama_kelurahan, value: data.data[i].id}
            arr_data_obj_kelurahan.push(data_obj)
          }
          setItems(arr_data_obj_kelurahan)
          setReq1(false)
          // console.log(arr_data_obj_kelurahan)

      }catch {
        console.error("Multiple fetch failed 1"); // Error message logs to console
      }
    }

    useEffect(() => {
      console.log(value)
    }, [value]);

    useEffect(() => {
      setFetchedState('loading')
      if (value){
        console.log(value)
      }else{
        setTimeout(()=>makeRequests1(),3000);
      }
    },[]);

    //akhir make request 1
    

    //mulai makeRequests2

    async function makeRequests2() {
      console.log("makerequest 2")
      try{
          const response = await fetch("http://103.37.124.94:1337/api/kelurahans?pagination[pageSize]=200&populate=data_sekolas");
          const data = await response.json();
  
          dataKelurahanSekolah = data
          // console.log(dataKelurahanSekolah)
          obj_sekolah = {}
          for (let i in dataKelurahanSekolah.data){
              // console.log(dataKelurahanSekolah.data[i])
  
              nama_kelurahan_sekolah = dataKelurahanSekolah.data[i].attributes.nama_kelurahan
              id = dataKelurahanSekolah.data[i].id
  
              arr_data_sekolah = []
              for (let j in dataKelurahanSekolah.data[i].attributes.data_sekolas.data){
                  id_sekolah = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].id
                  nama_sekolah  = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.nama_sekolah
                  alamat_sekolah = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.alamat_sekolah
                  akreditasi = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.akreditasi_sekolah
                  koordinat = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.koordinat
                  kode_sekolah = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.kode_sekolah
                  link = dataKelurahanSekolah.data[i].attributes.data_sekolas.data[j].attributes.link
                  obj_data_sekolah_temp  = {id_sekolah : id_sekolah, akreditasi:akreditasi,  nama: nama_sekolah, alamat: alamat_sekolah, koordinat: koordinat, kode: kode_sekolah, link : link, foto:null, jarak:null, arah:null} 
                  arr_data_sekolah.push(obj_data_sekolah_temp)
              }
              obj_sekolah[id] = {nama_kelurahan:nama_kelurahan_sekolah, sekolah: arr_data_sekolah}
          }
          // console.log(obj_sekolah)
          setDataKelurahan(obj_sekolah)
          setStatusKelurahan(false)
  
      }catch {
        console.error("Multiple fetch failed 2"); // Error message logs to console
      }
  }

  useEffect(() => {
    setFetchedState('loading')
    setTimeout(()=>makeRequests2(),3000);
  },[]);
    //akhir makeRequests2()


    //mulai makeRequests3()

    const [Foto, setFoto] = useState()
    async function makeRequests3() {
      console.log('makeRequests 3')
      try{
          const response = await fetch("http://103.37.124.94:1337/api/data-sekolas?populate=foto_sekolah&pagination[pageSize]=200");
          const data = await response.json();
          // console.log(data.data);
          dataSekolah = data
          obj_foto = {}
          for (let i in dataSekolah.data){
              // console.log(dataSekolah.data[i].attributes.foto_sekolah.data[0].attributes.formats.thumbnail.url)
              id = dataSekolah.data[i].id
              nama = dataSekolah.data[i].attributes.nama_sekolah
              thumbnail = dataSekolah.data[i].attributes.foto_sekolah.data[0].attributes.formats.thumbnail.url
              foto_obj_temp = {nama:nama, thumbnail:thumbnail}
              obj_foto[id]= foto_obj_temp
          }
          setFoto(obj_foto)
          // console.log(obj_foto)
  
      }catch {
        console.error("Multiple fetch failed 3"); // Error message logs to console
      }
  }

  useEffect(() => {
    setFetchedState('loading')
    setTimeout(()=>makeRequests3(),3000);
  },[]);
  //akhir makeRequests3()

  //mulai update data sesuai request keluraha()
    useEffect(() => {
      setFetchedState('loading')

      if (dataKelurahan){
        // console.log(dataKelurahan)
        // console.log(typeof(value) )
        // console.log(value)
        // console.log(dataKelurahan[value.toString()].sekolah)
        for (let i in dataKelurahan[value.toString()].sekolah){
          id = dataKelurahan[value.toString()].sekolah[i].id_sekolah
          
          //hitung jarak
          
          // console.log(dataKelurahan[value.toString()].sekolah[i].jarak)
          koordinat = dataKelurahan[value.toString()].sekolah[i].koordinat
          // console.log(datalocation.coords.latitude+','+datalocation.coords.longitude)
          // console.log(koordinat)

          // const options = {
          //   method: 'GET',
          //   headers: {
          //     'X-RapidAPI-Key': 'e3a2658bf1mshdec51abb7a633e9p180578jsn450d4f610839',
          //     'X-RapidAPI-Host': 'waze.p.rapidapi.com'
          //   }
          // };
          // setTimeout(function() {
          // fetch('https://waze.p.rapidapi.com/driving-directions?source_coordinates='+datalocation.coords.latitude+','+datalocation.coords.longitude+'&destination_coordinates='+koordinat+','+ options)
          //   .then(response => response.json())
          //   .then(response => console.log(response))
          //   .catch(err => console.error(err));
          // }, 30000);

          
          // const options = {
          //   method: 'GET',
          //   url: 'https://waze.p.rapidapi.com/driving-directions',
          //   delayed: true,
          //   params: {
          //     source_coordinates: datalocation.coords.latitude+','+datalocation.coords.longitude,
          //     destination_coordinates: koordinat
          //   },
          //   headers: {
          //     'X-RapidAPI-Key': 'e3a2658bf1mshdec51abb7a633e9p180578jsn450d4f610839',
          //     'X-RapidAPI-Host': 'waze.p.rapidapi.com'
          //   }
          // };

          // console.log(options)
          // axios.request(options)

        //   setTimeout(function() {
        //   axios.request(options).then(function (response) {
        //     console.log("0kkkk")
        //     // console.log(response);
        //       // console.log(response.data.data[0].length_meters)
        //       dataKelurahan[value.toString()].sekolah[i].jarak = response.data.data[0].length_meters
        //   }).catch(function (error) {
        //     console.error(error);
        //   });
        // }, 30000);


          // console.log(dataKelurahan[value.toString()].sekolah[i].jarak)

          // axios.request(options).then((response) =>{
            // console.log(options)
            // console.log(response);
              // console.log(response.data.data[0].length_meters)
              // dataKelurahan[value.toString()].sekolah[i].jarak = response.data.data[0].length_meters
          // });

          //akhir hitung jarak

          arah = 'https://www.google.com/maps/dir/'+datalocation.coords.latitude+','+datalocation.coords.longitude +'/'+ koordinat
          dataKelurahan[value.toString()].sekolah[i].arah = arah
          // console.log(dataKelurahan[value.toString()].sekolah[i].arah)

          dataKelurahan[value.toString()].sekolah[i].foto = 'http://103.37.124.94:1337'+Foto[id].thumbnail
          // console.log(dataKelurahan[value.toString()].sekolah[i].foto)
          // console.log(Foto[id].thumbnail)
        }
      }

    },[value]);

    useEffect(() => {
      setFetchedState('loading')
      if(dataKelurahan){
        setRender(dataKelurahan[value.toString()].sekolah)
      }
      console.log(dataRender)
    },[value]);




  return (
    <View style={StyleSheet.absoluteFillObject}> 
      <MapView style={StyleSheet.absoluteFillObject}
                region={region} />
        <View style={{marginTop:50}}>
        </View>
        <View style={{flexDirection:'row'}}>
          <About/>
          <Text style={{fontSize:28,fontWeight:'bold', textAlign:'center', marginTop:10}}>Zonasi SMP Kota Kendari</Text>
        </View>
        
        <View style={{marginTop:5, marginLeft:10, marginRight:10, zIndex: 1}} >
              <DropDownPicker
              dropDownDirection="BOTTOM"
              searchTextInputStyle={{
                color:'#FFFFFF',
                backgroundColor:'skyblue',
                borderWidth:0,
                elevation:2,
                borderRadius:3,
                paddingVertical:8,
              }}
              placeholder="Pilih Kelurahan Domisi Anda!"
              searchPlaceholder="Ketikkan Nama Kelurahan..."
              searchable={true}
              listMode="FLATLIST"
              flatListProps={{
                initialNumToRender: 10
              }}
              modalProps={{
                animationType: "fade"
              }}

              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              scrollViewProps={{
                decelerationRate: "fast"
              }}
            />
        </View>
        {/* <ScrollView> */}
        <View style={{marginBottom:0, flex:6}}>
        {/* <MyArray data={dataRender}/> */}
        
          <FlatList
              data={dataRender}
              renderItem={({item}) => 
              // <Item title={item.title} />
              <Card
              nama_sekolah = {item.nama}//"SMP 1 Kendari"
              akreditas = {item.akreditasi}//"A"
              alamat={item.alamat}//"Jalan menanasa danda nf adn fnjdsnfad fnsdfnsdj fnjnfjsdnfj njfsd"
              foto={item.foto}//'https://lh3.googleusercontent.com/a/AGNmyxb6nKK5rEp0uhIwX6lA7fiEMX1LJkUIizJdnyhTIXk=s360'
              url ={item.arah}//'https://www.google.com/maps/dir/Toko+Tani+Zam+Jaya/-3.9947499,122.5124939/@-3.9933099,122.5141307,19.22z/data=!4m8!4m7!1m5!1m1!1s0x2d988d4a0b65c5e5:0x4241e0fe24d50cbd!2m2!1d122.5147712!2d-3.9928824!1m0'
              Detail = {item.link}
              />
              }
              keyExtractor={item => item.id_sekolah}
            />
            
            
        </View>
        {/* </ScrollView> */}
        <View>
              {/* {/* <Text> </Text> */}
              
              <Text style={{textAlign:'center'}}></Text>
        </View>

      
  <View/>
  </View>
  //{/* </SafeAreaView> */}
  );
}

const Rute = ({a})=> {
  const [arah, setArah] = useState({a});
  // console.log(arah.a)
  const pressURL = useCallback(async () => {
    // console.log(arah)
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(arah.a);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(arah.a);
    } else {
      Alert.alert(`Don't know how to open this URL: ${arah.a}`);
    }
  },);
  return(
    <View>
      <Button
        onPress={pressURL}
        title="Rute"
        color="#57C5B6"
        accessibilityLabel="Learn more about this purple button"
            // style={{flex:1}}
          />
    </View>

  );
}

// const Jarak = () =>{

//   const options = {
//             method: 'GET',
//             headers: {
//               'X-RapidAPI-Key': 'e3a2658bf1mshdec51abb7a633e9p180578jsn450d4f610839',
//               'X-RapidAPI-Host': 'waze.p.rapidapi.com'
//             }
//           };
//           setTimeout(function() {
//           fetch('https://waze.p.rapidapi.com/driving-directions?source_coordinates='+datalocation.coords.latitude+','+datalocation.coords.longitude+'&destination_coordinates='+koordinat+','+ options)
//             .then(response => response.json())
//             .then(response => console.log(response))
//             .catch(err => console.error(err));
//           }, 30000);

//   return (
//     console.log(response)
//   );
// }

const Detail = ({a})=> {
  // console.log(a)
  const [arah, setArah] = useState({a});
  const [result, setResult] = useState(null);
  const pressURL = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(arah.a); //WebBrowser.openBrowserAsync
    if (supported) {
      let result = await WebBrowser.openBrowserAsync(arah.a);
      setResult(result);

    } else {
      Alert.alert(`Don't know how to open this URL: ${arah.a}`);
    }
  },);
  return(
    <View>
      <Button
        onPress={pressURL}
        title="Detail"
        color="#159895"
        accessibilityLabel="Learn more about this purple button"
            // style={{flex:1}}
          />
          {/* <Text>{result && JSON.stringify(result)}</Text> */}
    </View>

  );
}

const Card = (props) =>{


  urlPendaftaran = 'https://dikmudora.kendarikota.go.id/ppdb/?m=home&j=smp'
  const pressPendaftaran = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(urlPendaftaran);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(urlPendaftaran);
    } else {
      Alert.alert(`Don't know how to open this URL: ${urlPendaftaran}`);
    }
  }, [urlPendaftaran]);

  return(
    <View>
      <View style={{flexDirection:'row', backgroundColor:'#F9F5EB', borderRadius:10, marginTop:7, opacity: 1}}>
      <View>
        <Image source={{
          uri:props.foto
        }}
        style={{width:150, height:120, borderRadius:5, marginRight:7}}
        />
      </View>
      <View>
        <View style={{flexDirection:'row'}}>
          <Text style={{flex: 1, flexWrap: 'wrap', fontSize:15, fontWeight:'bold'}}>{props.nama_sekolah}</Text>
        </View>
        <Text style={{fontSize:14, fontWeight:'bold'}}>Akreditasi: {props.akreditas}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>Alamat : {props.alamat}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
         

          <Rute a= {props.url}/>
          <Detail a= {props.Detail}/>
          <Button
            onPress={pressPendaftaran}
            title="Pendaftaran"
            color="#1A5F7A"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>  
      </View>
      
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});





// import React, {useState} from 'react';
import {Alert, Modal, Pressable} from 'react-native';

const About = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    // style={styles4.centeredView}
    <View >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles4.centeredView}>
          <View style={styles4.modalView}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>Tentang Kami</Text>
            <Text>Sistem Informasi Zonasi Sekolah Menengah Pertama (SMP) Kota Kendari</Text>
            <Text style={{fontSize:13, fontWeight:'bold', textAlign:'left'}}>Versi Beta</Text>
            <Text>Nama dan NIM</Text>
            <Text>Dosen Pembimbing:</Text>
            <Text>1. Nama</Text>
            <Text>2. Nama</Text>
            <Text >Program Studi Pendidikan Teknologi Informasi</Text>
            <Text >Universitas Muhammadiyah Kendari</Text>
            <Pressable
              style={[styles4.button, styles4.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles4.textStyle}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles4.button, styles4.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles4.textStyle}>[ZS]</Text>

        
      </Pressable>
    </View>
  );
};

const styles4 = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#1A5F7A',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});