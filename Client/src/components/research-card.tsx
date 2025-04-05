import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const researchCard = (stock:string) => {
    return (
     <Card>
        <CardHeader>
            <CardTitle>{stock}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <p>Research</p>
                </div>
                </div>
        </CardContent>
     </Card>
    )
}