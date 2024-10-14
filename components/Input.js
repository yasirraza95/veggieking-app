import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'

const Input = (props) => {
    const onChangeText = (text) => {
        // props.onInputChanged(props.id, text)
    }

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    { borderColor: COLORS.gray4 },
                ]}
            >
                {props.icon && (
                    <props.iconPack
                        name={props.icon}
                        size={24}
                        style={[
                            styles.icon,
                            { color: COLORS.black },
                        ]}
                    />
                )}
                <TextInput
                    {...props}
                    // onChangeText={onChangeText}
                    style={styles.input}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}
                />
            </View>
            {props.errorText && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText[0]}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: COLORS.gray,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding2,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 5,
        flexDirection: 'row',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        color: COLORS.black,
        flex: 1,
        fontFamily: 'regular',
        paddingTop: 0,
    },
    errorContainer: {
        marginVertical: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
})
export default Input