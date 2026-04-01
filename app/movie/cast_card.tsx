import { View, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import { CastDetails } from "./[id]";

export default function CastCard(cast: CastDetails){

    return (
        <View style={styles.castList}>

        <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${cast.profile_path}` }}
            style={styles.poster}
            resizeMode="cover"
        />

        <View style={styles.castInfo}>
            <Text style={styles.castName}>{cast.name}</Text>
            <Text style={styles.castCharacter}>{cast.character}</Text>
        </View>

        </View>
    )

}

const styles = StyleSheet.create({
    castList:{padding:20, paddingLeft:0},
    castInfo:{display:'flex', alignItems:'center', paddingTop:10, paddingBottom:10},
    castName:{color:'white', fontWeight:'bold',  },
    castCharacter:{color:'grey', fontWeight:'regular'},
    poster: { width: 100, height:100, borderRadius:100},
});
