<template>
  <div class="text-white p-4 w-1/2">
    <form @submit.prevent="submit" autocomplete="off">

      <!-- Nome -->
      <div class="relative">
        <div class="mb-3">
          <span class="text-sm">Nome:</span> <span class="text-red-500 font-bold">*</span><br>
          <label>
            <input type="text" v-model="name" @click="onClickName" class="text-gray-900 p-2 font-semibold w-full" :class="{ 'border-2 border-red-500 h-10' : nameErr, 'relative z-20' : isSearchOpen, 'bg-gray-400' : op === 'update' }" :readonly="op === 'update'" autocomplete="off">
          </label> <span v-if="nameErr" class="text-red-500 font-semibold text-sm ml-1">{{ nameErr }}</span>
        </div>

        <button v-if="isSearchOpen" @click="isSearchOpen = false" class="fixed inset-0 w-full h-full bg-black opacity-25"></button>

        <!-- Dropdown Search -->
        <div v-if="isSearchOpen" class="absolute left-0 bg-white rounded-lg py-2 flex-wrap z-20 shadow-md">
          <a v-for="user in userList" :key="user.id" href="#" class="block px-4 py-1 text-gray-800 hover:bg-gray-500 hover:text-gray-200" @click="pickName(user.id, user.name)">{{ user.name }}</a>
        </div>
      </div>

      <!-- Motivo -->
      <div class="mb-3">
        <span class="text-sm">Motivo:</span> <span class="text-red-500 font-bold">*</span><br><br>
        <label>
          <textarea v-model="debt.reason" class="text-gray-900 p-2 font-semibold w-full" :class="{ 'border-2 border-red-500 h-10' : reasonErr }" rows="4" autocomplete="off"></textarea>
        </label><span v-if="reasonErr" class="text-red-500 font-semibold text-sm ml-1">{{ reasonErr }}</span>
      </div>

      <!-- Valor -->
      <div class="mb-3">
        <span class="text-sm">Valor:</span> <span class="text-red-500 font-bold">*</span><br>
        <label>
          <input type="text" v-model="money" style="direction: revert" class="text-gray-900 p-2 font-semibold w-full" :class="{ 'border-2 border-red-500 h-10' : nameErr }" autocomplete="off">
        </label>
        <span v-if="valueErr" class="text-red-500 font-semibold text-sm ml-1">{{ valueErr }}</span>
      </div>

      <!-- Data -->
      <div class="mb-3">
        <span class="text-sm">Data:</span> <span class="text-red-500 font-bold">*</span><br>
        <label>
          <input type="text" v-model="debt.date" v-mask="'##/##/####'" class="text-gray-900 p-2 font-semibold" :class="{ 'border-2 border-red-500 h-10' : dateErr }" placeholder="DD/MM/YYYY"> <span v-if="dateErr" class="text-red-500 font-semibold text-sm ml-1">{{ dateErr }}</span>
        </label>
      </div>

      <!-- Botões -->
      <div class="mb-3">
        <button class="mt-2 px-3 py-1 bg-gray-800 rounded-md shadow font-semibold align-middle focus:border-green-500">{{ btnSubmit }}</button>
        <button class="ml-3 mt-2 px-3 py-1 bg-white text-gray-900 rounded-md shadow font-semibold align-middle focus:border-green-500 focus:outline-none" @click.prevent="debtDelete">Excluir</button>
      </div>
    </form>
    <div class="mt-4 bg-green-600 text-white font-semibold rounded-sm p-2" v-if="status === 'createdOK'">Uma nova Dívida foi criada!</div>
    <div class="mt-4 bg-green-600 text-white font-semibold rounded-sm p-2" v-if="status === 'updatedOK'">A Dívida foi atualizada com sucesso!</div>
    <div class="mt-4 bg-red-600 text-white font-semibold rounded-sm p-2" v-if="status === 'fail'">Alguma coisa deu errado!
      {{ msgErr }}</div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "Debt",
  data: () => ({
    debt: {
      name: '',
    },
    isSearchOpen: false,
    name: '',             //nome do usuário
    selectedName: false,  //marca que o nome a partir da dropdown foi selecionado, portanto, temos o seu ID
    userList: [],         //lista de usuários para um dropdown
    money: '',            //máscara para formatação de dinheiro que será mostrado na tela
    btnSubmit: '',        //nome do botão submite a depender da operação [Criar, Atualizar]
    op: '',               //operação da página [create, update]
    status: '',           //status da operação quando a página é submetida [createdOK, updatedOK, fail]
    msgErr: '',           //mensagem geral de erro na tela, quando erros ocorrem
    nameErr: '',          //mensagem de erro para o campo Nome
    valueErr: '',         //mensagem de erro para o campo Valor
    reasonErr: '',        //mensagem de erro para o campo Motivo
    dateErr: '',          //mensagem de erro para o campo Data
  }),
  created () {
    //captura o evento ao clicar o botão Esc para sair do dropdown de pesquisa de usuário
    this.bindEsc()
  },
  mounted () {
    //prepara a tela de Dívida para Cadastro ou Atualização

    let id = this.$route.params.id

    if (id) {
      ///////////////////////////////////
      // Monta a página para -> UPDATE
      this.op = 'update'
      this.btnSubmit = 'Atualizar'

      //pega da REST API a dívida através de sua ID.
      this.$axios.get('/debt/' + id).then( (res) => {
        const { content } = res.data

        //prepara a dívida vinda do back-end para mostrar na tela
        this.debt = {
          _id: content._id,
          name: content.name,
          value: content.value,
          reason: content.reason,
          date: content.date
        }

        //para bind de alguns dos campos que serão tratados/calculados de forma diferente
        this.money = this.debt.value
        this.name = this.debt.name

      }).catch( (err) => { console.error(err) } )
    } else {
      ///////////////////////////////////
      // Monta a página para -> CREATE
      this.op = 'create'
      this.btnSubmit = 'Salvar'
    }
  },
  methods: {
    bindEsc() {
      //permite fechar a dropdown de pesquisa de usuário se ao apertar a tecla Esc.
      const handleEscape = (e) => {
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.isSearchOpen = false
        }
      }

      document.addEventListener('keydown', handleEscape)
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', handleEscape)
      })
    },
    submit() {
      //limpa qualquer mensagens prévias de uma tentativa de submit anterior da tela.
      this.cleanStatus()

      switch (this.op) {
        case 'create': {
          ///////////////////////////////////
          // POST REQUEST -> CREATE

          this.$axios.post('/debt', this.debt)
            .then((res) => {
              if (!res.data.error) {
                this.status = 'createdOK'
              } else {
                //FAIL - Something went wrong
                this.processError(res.data.error)
                this.status = 'fail'
              }
            }).catch((err) => {
              this.status = 'fail'
              this.msgErr = err
          })
          break
        }
        case 'update': {
          ///////////////////////////////////
          // PATCH REQUEST -> UPDATE

          this.$axios.patch('/debt/', this.debt)
            .then((res) => {

              if (!res.data.error) {
                //OK - Updated
                this.status = 'updatedOK'
              } else {
                //FAIL - Something went wrong
                this.processError(res.data.error)
                this.status = 'fail'
              }
            }).catch((err) => {
              this.status = 'fail'
              this.msgErr = err
          })
          break
        }
      }
    },
    //limpa todos as mensagens antes do submit
    cleanStatus() {
      this.status = ''
      this.msgErr = ''
      this.nameErr = ''
      this.valueErr = ''
      this.reasonErr = ''
      this.dateErr = ''
    },
    //limpa todos os campos
    cleanFields() {
      this.debt.name = ''
      this.debt.reason = ''
      this.debt.value = null
      this.debt.date = null
    },
    processError(error) {
      error.forEach(e => {
        switch (e.context.key) {
          case 'userID' : {
            this.nameErr = e.message
            break
          }
          case 'value' : {
            this.valueErr = e.message
            break
          }
          case 'reason' : {
            this.reasonErr = e.message
            break
          }
          case 'date' : {
            this.dateErr = e.message
            break
          }
        }
      })
    },
    /**
     * Quando coloca
     */
    onClickName() {
      if (this.op === 'update')
        return

      this.isSearchOpen = !this.isSearchOpen

      //força em chamar o watch de name para trazer já a lista de usuários à seleção
      if (this.name.length === 0)
        this.name = ' '
    },
    pickName(userID, username) {
      this.name = username
      this.debt.userID = userID
      this.selectedName = true

      //this.onSearchFocus()
      this.isSearchOpen = !this.isSearchOpen
    },
    debtDelete() {
      //caso exista o registro
      if (this.debt._id) {
        console.log('Tenta deletar o conteúdo')
        this.$axios.delete('/debt/' + this.debt._id).then( (res) => {
          if (res) {
            router.push('/')
          }
        }).catch( (err) => {
          this.msgErr = 'Não foi possível excluir o registro. ' + err
        })
      }
    },
    //cancela qualquer operação e volta pra tela raíz
    cancel() {
      this.cleanFields()
      router.push('/')
    }
  },
  watch: {
    //o campo Nome deve ser observável para que com, qualquer alteração, possa ser criada a dropdown list de nomes
    //de usuários.
    name(value) {
      let uri = ''
      this.userList = []

      if (!this.selectedName)
        this.debt.userID = -1

      if (value.trim().length === 0) {
        uri = '/users'
      } else {
        uri = '/user/' + value
      }

      this.$axios.get(uri).then( (res) => {
        const { content } = res.data

        content.forEach(e => {
          this.userList.push({ id: e.id, name: e.name })
        })

      }).catch( (err) => { console.error(err) } )

    },
    money(value, oldValue) {
      if (value !== oldValue) {
        //retira toda a formação do valor corrente
        value = Number(String(value).replace(/[^0-9]+/g,'').replace(/\./g, ''))
        //atribui para o campo que receberá apenas o valor numérico
        this.debt.value = value
        //formata para moeda brasileira
        value = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        //exibe o valor já formatado para o cliente
        this.money = value
      }
    },
    //atualiza as mensagens após o submit. Tanto msgs de sucesso quanto de erro.
    status(value) {
      if (value === 'createdOK' ||
          value === 'updatedOK'
      ) {
        setTimeout(function() {
          router.push('/')
        }, 1500)

        clearInterval()
      }
    }
  }
}
</script>

<style scoped>
</style>