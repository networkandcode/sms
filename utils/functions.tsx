export const toTitleCase = (value: string) => {
    let temp: string[] = []
    value?.split(' ').forEach( (v: string) =>
        temp.push(v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
    )    
    return(temp.join(' '))
}

export const validateName = (value: string) => {
    const pattern = /^[a-zA-Z\s]*$/
    return pattern.test(value)
}

export const validateNumbers = (value: string) => {
    const pattern = /^[0-9]*$/
    return pattern.test(value)
}