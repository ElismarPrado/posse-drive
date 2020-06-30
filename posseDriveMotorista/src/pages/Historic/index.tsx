import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';

const Historic = () => {

  const navigation = useNavigation()

    return(
    <View>
        <Text>Hello Historic</Text>
    </View>
    )
}

export default Historic