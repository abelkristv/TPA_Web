import { Theme as EmotionTheme } from '@emotion/react';
import beachDays from './background/day/beach.webp'
import beachNight from './background/night/beach.webp'
import traveloHIDay from './logo/day/logo.webp'
import traveloHINight from './logo/night/logo.webp'

export const beachDayBg = beachDays;
export const beachNightBg = beachNight;

export const traveloHiDayLogo = traveloHIDay;
export const traveloHINightLogo = traveloHINight;

export type TraveloHiTheme = EmotionTheme & {
    name: string
    colors?: {
        background?: string
        fonts?: string
        primary?: string
        primaryDarkened? : string
    }
};

export const dayTheme: TraveloHiTheme = {
    name: 'day',
    colors: {
        background: 'white',
        fonts: '#0F0F0F',
        primary: '#00dbff',
        primaryDarkened: '#00a6c2'
    }
}

export const nightTheme: TraveloHiTheme = {
    name: 'night',
    colors: {
        background: '#262626',
        fonts: 'white',
        primary: '#10a5f5',
        primaryDarkened: '#0b7fbd'
    }
}