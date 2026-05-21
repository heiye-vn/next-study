export async function GET(){
    const res = await fetch('https://dog.ceo/api/breeds/image/random', {
        next: { revalidate: 5 } // 每 5 秒重新抓取数据
    })
    const data = await res.json()
    console.log(data)

    return Response.json(data)
}