import { useMutation } from '@tanstack/react-query'
import { Button } from '../../common/components/ui/Button'
import { useExampleStore } from '../../common/stores/exampleStore'
import authService from '../../common/lib/services/authService'

const Homepage = () => {
  const {value} = useExampleStore()

  const {mutate: login} = useMutation({
    mutationFn: async (input: LoginInputType) => {
      const {data} = await authService.login(input)

      return data
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log({error})
    }
  })


  return (
    <div>Homepage {value}
      <Button onClick={() => login({username: "sdjklfh"})}>Click me</Button>
    </div>
  )
}

export default Homepage