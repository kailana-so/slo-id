const generateFriendlyId = (username: string) => {
    const prefix = username.slice(0,2)
    const rand = [] 
    while(rand.length < 6) {
        rand.push(Math.floor(Math.random() * 6))
    }
    return `${prefix}-${rand.join("")}`
}

export { generateFriendlyId }