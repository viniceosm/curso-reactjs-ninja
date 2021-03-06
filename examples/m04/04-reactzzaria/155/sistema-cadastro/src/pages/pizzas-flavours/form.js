import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  Button,
  Grid,
  InputLabel,
  Typography
} from '@material-ui/core'
import { Form, FormContainer, TextField } from 'ui'
import { useCollection } from 'hooks'
import { PIZZAS_FLAVOURS } from 'routes'

function FormRegisterFlavour () {
  const { id } = useParams()
  const nameField = useRef()
  const history = useHistory()
  const { data: pizzasSizes } = useCollection('pizzasSizes')
  const { add } = useCollection('pizzasFlavours')
  console.log('pizzasSizes:', pizzasSizes)

  const texts = useMemo(() => ({
    title: id ? 'Editar sabor' : 'Cadastrar novo sabor',
    button: id ? 'Salvar' : 'Cadastrar'
  }), [id])

  useEffect(() => {
    nameField.current.focus()
  }, [id])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const fields = e.target.elements

    const normalizedData = {
      name: fields.name.value,
      image: fields.image.value,
      value: pizzasSizes.reduce((acc, size) => {
        acc[size.id] = +fields[`size-${size.id}`].value
        return acc
      }, {})
    }

    await add(normalizedData)
    history.push(PIZZAS_FLAVOURS)
  }, [pizzasSizes, add, history])

  return (
    <FormContainer>
      <Grid item xs={12}>
        <Typography variant='h4'>
          {texts.title}
        </Typography>
      </Grid>

      <Form onSubmit={handleSubmit}>
        <TextField
          label='Nome do sabor'
          name='name'
          inputRef={nameField}
        />

        <TextField
          label='Link para imagem desse sabor'
          name='image'
        />

        <Grid item xs={12}>
          <InputLabel>Valores (em R$) para cada tamanho:</InputLabel>
        </Grid>

        {pizzasSizes?.map(size => (
          <TextField
            key={size.id}
            label={size.name}
            name={`size-${size.id}`}
            xs={3}
          />
        ))}

        <Grid item container justify='flex-end' spacing={2}>
          <Grid item>
            <Button variant='contained' component={Link} to={PIZZAS_FLAVOURS}>
              Cancelar
            </Button>
          </Grid>

          <Grid item>
            <Button variant='contained' color='primary' type='submit'>
              {texts.button}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormContainer>
  )
}

export default FormRegisterFlavour
