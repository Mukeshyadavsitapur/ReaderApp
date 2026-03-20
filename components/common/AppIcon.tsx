import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface AppIconProps {
    size?: number;
    style?: StyleProp<ImageStyle>;
    tintColor?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ size = 24, style, tintColor }) => {
    return (
        <Image 
            source={require('../../assets/images/android-icon-background.png')}
            style={[
                { width: size, height: size },
                style,
                tintColor ? { tintColor } : null
            ]}
            resizeMode="contain"
        />
    );
};

export default AppIcon;
