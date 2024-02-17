export const generateNumer = (min: number = 1, max: number = 60): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}