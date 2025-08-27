'use client'

import useStore from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function BearCounter() {
  const { bears, name, addBear, removeBear, updateName, reset } = useStore()

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Bear Counter</CardTitle>
        <CardDescription>A simple Zustand + shadcn/ui example</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Bears:</span>
          <span className="text-2xl font-bold">{bears}</span>
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => updateName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter your name"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button onClick={addBear} size="sm">
            Add Bear
          </Button>
          <Button onClick={removeBear} variant="outline" size="sm">
            Remove Bear
          </Button>
        </div>
        <Button onClick={reset} variant="destructive" size="sm">
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}