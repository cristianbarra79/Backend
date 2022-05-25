process.on("message", cantidad =>{
    const numero = {}
    for (let index = 0; index < cantidad; index++) {
        let azar = Math.floor(Math.random() * (1000 - 0 + 1)) + 0
        if(numero[azar]){
            numero[azar] += 1
        }else{
            numero[azar] = 1
        }
    }    
    process.send(numero)
})