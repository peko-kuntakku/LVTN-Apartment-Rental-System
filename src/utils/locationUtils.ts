export default function transformProvinceData(resData: any) {

}

export function markRequireAll(query: string) {
    const words = query.split(/\s+/)
    return words.map((w: any) => `+${w}`).join(' ')
}