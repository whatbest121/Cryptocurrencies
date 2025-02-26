function a(input1: Buffer<ArrayBufferLike>, input2: Buffer<ArrayBufferLike>,) {
    const inp1 = [...input1.toString()].filter(v => v !== "\n")
    let c: number = Number(input2)
    const transitions: Record<string, Record<number, number>> = {
        a: { 1: 2, 2: 1 },
        b: { 2: 3, 3: 2 },
        c: { 3: 1, 1: 3 }
    };

    const d = inp1.reduce((state, char) => {
        return transitions[char]?.[state] ?? state
    }, c);
    console.log(d);
}
const inputs: Buffer[] = [];
process.stdin.on("data", (data) => {
    inputs.push(data)
    if (inputs.length === 2) {
        a(inputs[0], inputs[1])
    }
});