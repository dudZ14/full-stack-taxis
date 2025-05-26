const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
mongoose.set("strictQuery", false);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3064;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://dudidaxilacabu:HG199ojngd39892fdsAMMNnaNnAnNaN@cluster0.wvrr4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

const MoradaSchema = new mongoose.Schema({
  rua: String,
  numeroDaPorta: Number,
  codigoPostal: String,
  localidade: String,
  lat: { type: Number, required: false },
  lon: { type: Number, required: false },
}, { timestamps: true });

const TaxiSchema = new mongoose.Schema({
  matricula: String,
  anoDeCompra: Number,
  marca: { type: String, enum: ['Honda', 'Ford', 'Chevrolet', 'Toyota'], required: true },
  modelo: { type: String, enum: ['Civic', 'Accord', 'Jazz', 'Focus', 'Fiesta', 'Mustang', 'Cruze', 'Camaro', 'Spark', 'Corolla', 'Yaris', 'RAV4'], required: true },
  nivelDeConforto: { type: String, enum: ['básico', 'luxuoso'], required: true },
}, { timestamps: true });

const MotoristaSchema = new mongoose.Schema({
  nome: String,
  NIF: Number,
  genero: String,
  anoDeNascimento: Number,
  cartaDeConducao: { type: Number, required: true, unique: true },
  morada: { type: mongoose.Schema.Types.ObjectId, ref: 'Morada' },
}, { timestamps: true });

const PedidoSchema = new mongoose.Schema({
  moradaInicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Morada' },
  moradaFim: { type: mongoose.Schema.Types.ObjectId, ref: 'Morada' },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  numeroPessoas: Number,
  aceiteMotorista: { type: Boolean, default: false },
  aceiteCliente: { type: Boolean, default: false },
  pedidoConcluido: { type: Boolean, default: false },
  motoristaQueAceitou: String,
  motoristasRejeitados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', default: [] }],
  turno: { type: mongoose.Schema.Types.ObjectId, ref: 'Turno', default: null, required: false },
  distancia: { type: Number, default: 0 } ,
  distanciaDestino: { type: Number, default: 0 } ,
  nivelDeConforto: { type: String, enum: ['básico', 'luxuoso'], required: true },

}, { timestamps: true });


const ClienteSchema = new mongoose.Schema({
  nome: String,
  NIF: Number,
  genero: String
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  precoPorMinBasico: { type: Number, required: true, min: 0 },
  precoPorMinLuxuoso: { type: Number, required: true, min: 0 },
  acrescimoPercentual: { type: Number, required: true, min: 0 },
}, { timestamps: true });

const PeriodoSchema = new mongoose.Schema({
  inicio: { type: Date, required: true },
  fim: { type: Date, required: true },
}, { _id: false });

const TurnoSchema = new mongoose.Schema({
  taxi: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi', required: true },
  motorista: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', required: true },
  periodo: { type: PeriodoSchema, required: true },
}, { timestamps: true });


const ViagemSchema = new mongoose.Schema({
  pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true },
  periodo: { type: PeriodoSchema, required: true },
  moradaInicio: { type: Schema.Types.ObjectId, ref: 'Morada', required: true },
  moradaFim: { type: Schema.Types.ObjectId, ref: 'Morada' },
  numeroSequencia: { type: Number, required: true },
  numeroPessoas: Number,
  distancia: Number,
  custo: Number,
}, { timestamps: true });

const Morada = mongoose.model('Morada', MoradaSchema);
const Motorista = mongoose.model('Motorista', MotoristaSchema);
const Taxi = mongoose.model('Taxi', TaxiSchema);
const Cliente = mongoose.model('Cliente', ClienteSchema);
const Settings = mongoose.model('Settings', SettingsSchema);
const Turno = mongoose.model('Turno', TurnoSchema);
const Pedido = mongoose.model('Pedido', PedidoSchema);
const Viagem = mongoose.model('Viagem', ViagemSchema);

// Rotas com asyncHandler

app.get('/init', asyncHandler(async (req, res) => {
  await Promise.all([
    Morada.deleteMany({}),
    Motorista.deleteMany({}),
    Taxi.deleteMany({}),
    Settings.deleteMany({}),
    Cliente.deleteMany({}),
    Turno.deleteMany({}),
    Pedido.deleteMany({}),
    Viagem.deleteMany({}),
  ]);

  const moradas = await Morada.insertMany([
    { id: 1, rua: 'Rua da Aveleira', numeroDaPorta: 12, codigoPostal: '3750-364', localidade: 'Alcafaz' },
    { id: 2, rua: 'Rua Armindo Santos', numeroDaPorta: 45, codigoPostal: '3750-125', localidade: 'Águeda' },
    { id: 3, rua: 'Rua de São José ', numeroDaPorta: 22, codigoPostal: '1150-324', localidade: 'Lisboa' },
  ]);

  const taxis = await Taxi.insertMany([
    { matricula: 'AB-12-CD', anoDeCompra: 2020, marca: 'Toyota', modelo: 'Corolla', nivelDeConforto: 'básico' },
    { matricula: 'EF-34-GH', anoDeCompra: 2023, marca: 'Ford', modelo: 'Fiesta', nivelDeConforto: 'luxuoso' },
    { matricula: 'CD-34-AB', anoDeCompra: 2019, marca: 'Chevrolet', modelo: 'Spark', nivelDeConforto: 'luxuoso' },
  ]);

  const motoristas = await Motorista.insertMany([
    { nome: 'João Silva', NIF: 123456789, genero: 'Masculino', anoDeNascimento: 1980, cartaDeConducao: 123, morada: moradas[0]._id },
    { nome: 'Ana Costa', NIF: 987654321, genero: 'Feminino', anoDeNascimento: 1995, cartaDeConducao: 321, morada: moradas[1]._id },
    { nome: 'José Almeida', NIF: 675463765, genero: 'Masculino', anoDeNascimento: 2000, cartaDeConducao: 443, morada: moradas[1]._id },
  ]);

  await Settings.create({ precoPorMinBasico: 0.15, precoPorMinLuxuoso: 0.25, acrescimoPercentual: 20 });


  const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth();
const dia = hoje.getDate();

const turnosAna = [
  { inicio: new Date(ano, mes, dia, 11, 30), fim: new Date(ano, mes, dia, 17, 0) },
  { inicio: new Date(ano, mes, dia, 17, 0), fim: new Date(ano, mes, dia + 1, 0, 0) }, // até meia-noite
];

const turnosJoao = [
  { inicio: new Date(ano, mes, dia, 8, 0), fim: new Date(ano, mes, dia, 16, 0) },
  { inicio: new Date(ano, mes, dia, 16, 0), fim: new Date(ano, mes, dia, 24, 0) },
];

// Inserir turnos
await Turno.insertMany([
  ...turnosAna.map(periodo => ({ taxi: taxis[1]._id, motorista: motoristas[1]._id, periodo })),
  ...turnosJoao.map(periodo => ({ taxi: taxis[0]._id, motorista: motoristas[0]._id, periodo })),
]);


  res.json({ message: 'Base de dados inicializada!' });
}));

app.get('/moradas', asyncHandler(async (req, res) => {
  const moradas = await Morada.find().sort({ createdAt: -1 });
  res.json(moradas);
}));

app.get('/motoristas', asyncHandler(async (req, res) => {
  const motoristas = await Motorista.find().populate('morada').sort({ updatedAt: -1 });
  res.json(motoristas);
}));

// Obter motorista pelo ID
app.get('/motorista/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const motorista = await Motorista.findById(id).populate('morada');

  if (!motorista) {
    return res.status(404).json({ message: 'Motorista não encontrado.' });
  }

  res.json(motorista);
}));



app.get('/taxis', asyncHandler(async (req, res) => {
  const taxis = await Taxi.find().sort({ updatedAt: -1 });
  res.json(taxis);
}));

app.get('/clientes', asyncHandler(async (req, res) => {
  const clientes = await Cliente.find().sort({ createdAt: -1 });
  res.json(clientes);
}));

app.post('/morada', asyncHandler(async (req, res) => {
  const { rua, numeroDaPorta, codigoPostal, localidade, lat, lon } = req.body;

  if (!/^[0-9]{4}-[0-9]{3}$/.test(codigoPostal)) {
    return res.status(400).json({ message: 'Código postal inválido. O formato deve ser "1111-111".' });
  }

  const morada = new Morada({ rua, numeroDaPorta, codigoPostal, localidade, lat, lon });
  await morada.save();
  res.json(morada);
}));


app.get('/settings', asyncHandler(async (req, res) => {
  const settings = await Settings.find();
  res.json(settings);
}));

app.post('/motorista', asyncHandler(async (req, res) => {
  const { nome, NIF, genero, anoDeNascimento, cartaDeConducao, morada } = req.body;

  const anoAtual = new Date().getFullYear();
  if (anoAtual - anoDeNascimento < 18) {
    return res.status(400).json({ message: 'O motorista deve ter pelo menos 18 anos de idade.' });
  }

  if (!/^[1-9][0-9]{8}$/.test(NIF)) {
    return res.status(400).json({ message: 'NIF inválido. Deve conter 9 dígitos e não começar por 0.' });
  }

  if (!['Masculino', 'Feminino'].includes(genero)) {
    return res.status(400).json({ message: 'Género inválido. Valores permitidos: Masculino ou Feminino.' });
  }

  const motorista = new Motorista({ nome, NIF, genero, anoDeNascimento, cartaDeConducao, morada });
  await motorista.save();
  res.json(motorista);
}));

app.put('/motorista/:id', asyncHandler(async (req, res) => {
  const { nome, NIF, genero, anoDeNascimento, cartaDeConducao, morada } = req.body;

  const anoAtual = new Date().getFullYear();
  if (anoAtual - anoDeNascimento < 18) {
    return res.status(400).json({ message: 'O motorista deve ter pelo menos 18 anos de idade.' });
  }

  if (!/^[1-9][0-9]{8}$/.test(NIF)) {
    return res.status(400).json({ message: 'NIF inválido. Deve conter 9 dígitos e não começar por 0.' });
  }

  if (!['Masculino', 'Feminino'].includes(genero)) {
    return res.status(400).json({ message: 'Género inválido. Valores permitidos: Masculino ou Feminino.' });
  }

  const motoristaAtualizado = await Motorista.findByIdAndUpdate(
    req.params.id,
    { nome, NIF, genero, anoDeNascimento, cartaDeConducao, morada },
    { new: true }
  );

  if (!motoristaAtualizado) {
    return res.status(404).json({ message: 'Motorista não encontrado.' });
  }

  res.json(motoristaAtualizado);
}));


app.delete('/motorista/:id', asyncHandler(async (req, res) => {
  const motorista = await Motorista.findByIdAndDelete(req.params.id);

  if (!motorista) {
    return res.status(404).json({ message: 'Motorista não encontrado.' });
  }

  res.json({ message: 'Motorista removido com sucesso.' });
}));



app.post('/taxi', asyncHandler(async (req, res) => {
  const { matricula, anoDeCompra, marca, modelo, nivelDeConforto } = req.body;

  const anoAtual = new Date().getFullYear();
  if (anoDeCompra > anoAtual) {
    return res.status(400).json({ message: 'O ano de compra deve ser menor que o ano atual' });
  }

  if (!['básico', 'luxuoso'].includes(nivelDeConforto)) {
    return res.status(400).json({ message: 'Nível de conforto inválido. Permitidos: básico ou luxuoso.' });
  }

  const taxi = new Taxi({ matricula, anoDeCompra, marca, modelo, nivelDeConforto });
  await taxi.save();
  res.json(taxi);
}));

app.delete('/taxi/:id', asyncHandler(async (req, res) => {
  const taxi = await Taxi.findByIdAndDelete(req.params.id);

  if (!taxi) {
    return res.status(404).json({ message: 'Táxi não encontrado.' });
  }

  res.json({ message: 'Táxi removido com sucesso.' });
}));


app.put('/taxi/:id', asyncHandler(async (req, res) => {
  const { matricula, anoDeCompra, marca, modelo, nivelDeConforto } = req.body;

  const anoAtual = new Date().getFullYear();
  if (anoDeCompra > anoAtual) {
    return res.status(400).json({ message: 'O ano de compra deve ser menor que o ano atual.' });
  }

  if (!['básico', 'luxuoso'].includes(nivelDeConforto)) {
    return res.status(400).json({ message: 'Nível de conforto inválido. Permitidos: básico ou luxuoso.' });
  }

  const taxiAtualizado = await Taxi.findByIdAndUpdate(
    req.params.id,
    { matricula, anoDeCompra, marca, modelo, nivelDeConforto },
    { new: true }
  );

  if (!taxiAtualizado) {
    return res.status(404).json({ message: 'Táxi não encontrado.' });
  }

  res.json(taxiAtualizado);
}));

app.get('/taxi/:id', asyncHandler(async (req, res) => {
  const taxi = await Taxi.findById(req.params.id);

  if (!taxi) {
    return res.status(404).json({ message: 'Táxi não encontrado.' });
  }

  res.json(taxi);
}));



app.put('/settings', asyncHandler(async (req, res) => {
  const { precoPorMinBasico, precoPorMinLuxuoso, acrescimoPercentual } = req.body;

  if (precoPorMinBasico <= 0 || precoPorMinLuxuoso <= 0) {
    return res.status(400).json({ message: 'Preços por minuto devem ser positivos.' });
  }

  if (acrescimoPercentual < 0) {
    return res.status(400).json({ message: 'A percentagem de acréscimo deve ser positiva ou zero.' });
  }

  const updatedSettings = await Settings.findOneAndUpdate(
    {},
    { precoPorMinBasico, precoPorMinLuxuoso, acrescimoPercentual },
    { new: true }
  );

  if (!updatedSettings) {
    return res.status(404).json({ message: 'Definições não encontradas.' });
  }

  res.json(updatedSettings);
}));


// GET todos os turnos (ordenados por data de início ASC)
app.get('/turnos', asyncHandler(async (req, res) => {
  const turnos = await Turno.find()
    .populate('motorista')
    .populate('taxi')
    .sort({ 'periodo.inicio': 1 });  // ordem crescente pela data de início

  res.json(turnos);
}));


//obter turnos de um determinado motorista
app.get('/turnos/motorista/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const turnos = await Turno.find({ motorista: id })
    .populate('motorista')
    .populate('taxi')
    .sort({ 'periodo.inicio': 1 });

  res.json(turnos);
}));



// POST criar novo turno com validações
app.post('/turno', asyncHandler(async (req, res) => {
  const { taxi, motorista, periodo } = req.body;

  const inicio = new Date(periodo?.inicio);
  const fim = new Date(periodo?.fim);

  if (!inicio || !fim || isNaN(inicio) || isNaN(fim)) {
    return res.status(400).json({ message: 'Datas inválidas.' });
  }

  if (inicio >= fim) {
    return res.status(400).json({ message: 'O início do turno deve ser anterior ao fim.' });
  }

  const duracaoHoras = (fim - inicio) / (1000 * 60 * 60);
  if (duracaoHoras > 8) {
    return res.status(400).json({ message: 'A duração do turno não pode exceder 8 horas.' });
  }

  const agora = new Date();
  if (inicio <= agora) {
    return res.status(400).json({ message: 'O turno deve começar após a hora atual.' });
  }

  // Verifica se o motorista já tem outro turno nesse período
  const conflito = await Turno.findOne({
    motorista,
    $or: [
      { 'periodo.inicio': { $lt: fim }, 'periodo.fim': { $gt: inicio } }
    ]
  });

  if (conflito) {
    return res.status(400).json({ message: 'Este motorista já tem um turno nesse período.' });
  }

  const turno = new Turno({ motorista, taxi, periodo });
await turno.save();

// Recarrega com populate
const turnoPopulado = await Turno.findById(turno._id)
  .populate('motorista')
  .populate('taxi');

res.json(turnoPopulado);

}));

// POST para buscar táxis disponíveis para o turno (usando req.body)
app.post('/taxis-disponiveis', asyncHandler(async (req, res) => {
  const { inicio, fim } = req.body;

  // Verifique se as datas de início e fim são válidas
  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);
  
  if (isNaN(inicioDate) || isNaN(fimDate)) {
    return res.status(400).json({ message: 'Datas inválidas.' });
  }

  // Encontrar os táxis ocupados com turnos que se sobrepõem ao novo turno
  const turnosOcupados = await Turno.find({
    'periodo.inicio': { $lt: fimDate },
    'periodo.fim': { $gt: inicioDate },
  });

  const taxisOcupados = turnosOcupados.map(turno => turno.taxi.toString());

  // Encontrar os táxis disponíveis que não estão ocupados
  const taxisDisponiveis = await Taxi.find({
    '_id': { $nin: taxisOcupados },
  });

  res.json(taxisDisponiveis);
}));

app.post('/pedido', asyncHandler(async (req, res) => {
  const { moradaInicio, moradaFim, cliente, numeroPessoas, aceiteMotorista, aceiteCliente, pedidoConcluido,motoristaQueAceitou, nivelDeConforto } = req.body;

  if (!moradaInicio || !moradaFim || !cliente || !numeroPessoas) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (numeroPessoas <= 0) {
    return res.status(400).json({ message: 'O número de pessoas deve ser maior que zero.' });
  }

  const pedido = new Pedido({ moradaInicio, moradaFim, cliente, numeroPessoas, aceiteMotorista, aceiteCliente, pedidoConcluido,motoristaQueAceitou, nivelDeConforto });
  await pedido.save();

  const pedidoPopulado = await Pedido.findById(pedido._id)
    .populate('moradaInicio')
    .populate('moradaFim')
    .populate('cliente');

  res.status(201).json(pedidoPopulado);
}));

//atualizar aceite de um pedido
app.put('/pedido/:id/aceite', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { aceiteMotorista, aceiteCliente,motoristaQueAceitou } = req.body;

  const updateFields = {};
  if (aceiteMotorista !== undefined) updateFields.aceiteMotorista = aceiteMotorista;
  if (aceiteCliente !== undefined) updateFields.aceiteCliente = aceiteCliente;
  if (motoristaQueAceitou !== undefined) updateFields.motoristaQueAceitou = motoristaQueAceitou;

  const pedido = await Pedido.findByIdAndUpdate(
    id,
    updateFields,
    { new: true }
  )
    .populate('moradaInicio')
    .populate('moradaFim')
    .populate('cliente');

  if (!pedido) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  res.json(pedido);
}));

// Atualizar pedidoConcluido de um pedido
app.put('/pedido/:id/concluido', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pedidoConcluido } = req.body;

  // Atualiza o pedido especificado como atual
  const pedidoConcluidoizado = await Pedido.findByIdAndUpdate(
    id,
    { pedidoConcluido },
    { new: true }
  )
    .populate('moradaInicio')
    .populate('moradaFim')
    .populate('cliente');

  if (!pedidoConcluidoizado) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  res.json(pedidoConcluidoizado);
}));


app.get('/pedidos', asyncHandler(async (req, res) => {
  const pedidos = await Pedido.find()
    .populate('moradaInicio')
    .populate('moradaFim')
    .populate('cliente')
    .populate({
      path: 'turno',
      populate: [
        { path: 'motorista' },
        { path: 'taxi' }
      ]
    })
    .sort({ createdAt: -1 });

  res.json(pedidos);
}));


app.post('/cliente', asyncHandler(async (req, res) => {
  const { nome, NIF, genero } = req.body;

  // Validações básicas
  if (!nome || !NIF || !genero) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: nome, NIF, género.' });
  }

  if (!/^[1-9][0-9]{8}$/.test(NIF)) {
    return res.status(400).json({ message: 'NIF inválido. Deve conter 9 dígitos e não começar por 0.' });
  }

  if (!['Masculino', 'Feminino'].includes(genero)) {
    return res.status(400).json({ message: 'Género inválido. Valores permitidos: Masculino ou Feminino.' });
  }

  // Verifica se NIF já existe
  const nifExistente = await Cliente.findOne({ NIF });
  if (nifExistente) {
    return res.status(400).json({ message: 'Já existe um cliente com esse NIF.' });
  }

  const cliente = new Cliente({ nome, NIF, genero });
  await cliente.save();
  res.status(201).json(cliente);
}));

app.delete('/pedido/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pedido = await Pedido.findByIdAndDelete(id);

  if (!pedido) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  res.json({ message: 'Pedido eliminado com sucesso.' });
}));

app.post('/pedido/morada', asyncHandler(async (req, res) => {
  const { rua, numeroDaPorta, codigoPostal, localidade, lat, lon } = req.body;

  const morada = new Morada({ rua, numeroDaPorta, codigoPostal, localidade, lat, lon });
  await morada.save();
  res.json(morada);
}));

// PUT /pedido/:id/rejeitar-motorista
app.put('/pedido/:id/rejeitar-motorista', async (req, res) => {
  const { motoristaId } = req.body;
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).send("Pedido não encontrado");

    pedido.aceiteMotorista = false;
    pedido.motoristaQueAceitou = null;
    if (!pedido.motoristasRejeitados.includes(motoristaId)) {
      pedido.motoristasRejeitados.push(motoristaId);
    }

    await pedido.save();
    res.send(pedido);
  } catch (err) {
    res.status(500).send("Erro ao rejeitar motorista");
  }
});



function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = x => x * Math.PI / 180;
  const r = 6372.8; // raio da Terra em km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));

  return r * c;
}




app.get('/motorista/:id/turno-atual', async (req, res) => {
  try {
    const agora = new Date();
    const latMotorista = parseFloat(req.query.lat);
    const lonMotorista = parseFloat(req.query.lon);
    console.log("lat motorista:",latMotorista);
    console.log("lon motorista:",lonMotorista);

    if (isNaN(latMotorista) || isNaN(lonMotorista)) {
      return res.status(400).json({ message: 'Parâmetros lat e lon inválidos.' });
    }

    const turnoAtual = await Turno.findOne({
      motorista: req.params.id,
      'periodo.inicio': { $lte: agora },
      'periodo.fim': { $gte: agora }
    }).populate('taxi');

    if (!turnoAtual) {
      console.log("OLA2");
      return res.status(404).json({ message: 'Nenhum turno ativo no momento.' });
    }

    const pedidosPendentes = await Pedido.find({
      pedidoConcluido: false
    }).populate('moradaInicio').populate('moradaFim');

    const fimTurno = new Date(turnoAtual.periodo.fim);
    const minutosRestantes = (fimTurno - agora) / (1000 * 60);

    const pedidosValidos = [];

    for (const pedido of pedidosPendentes) {
      try {
        if (pedido.nivelDeConforto !== turnoAtual.taxi.nivelDeConforto) {
          continue;
        }

        const latInicio = pedido.moradaInicio.lat;
        const lngInicio = pedido.moradaInicio.lon;
        console.log("lat cli inicio:",latInicio);
        console.log("lon cli inicio:",lngInicio);
        const latFim = pedido.moradaFim.lat;
        const lngFim = pedido.moradaFim.lon;
        console.log("lat cli fim:",latFim);
        console.log("lon cli fim:",lngFim);

        const distanciaDestino = haversineDistance(latInicio, lngInicio, latFim, lngFim);
        const distanciaAoCliente = haversineDistance(latMotorista, lonMotorista, latInicio, lngInicio);
        const tempoEstimadoMinutos = distanciaAoCliente * 4 + distanciaDestino * 4;

        console.log("distancia destino: ", distanciaDestino);
        console.log("distancia ao cliente:", distanciaAoCliente);

        console.log("tempo estimado min:",tempoEstimadoMinutos);
        console.log("minutos restantes:",minutosRestantes);
        if (tempoEstimadoMinutos <= minutosRestantes) {
          pedido.distanciaDestino = distanciaDestino;
          pedido.distancia = distanciaAoCliente;

          await Pedido.updateOne(
            { _id: pedido._id },
            {
              $set: {
                distanciaDestino,
                distancia: distanciaAoCliente
              }
            }
          );

          console.log("distancia destino:",distanciaDestino);
          pedidosValidos.push(pedido);
        }

      } catch (innerErr) {
        console.warn(`Erro ao processar pedido ${pedido._id}:`, innerErr.message);
        continue;
      }
    }

    res.json({
      turnoAtual,
      pedidosValidos
    });

  } catch (err) {
    console.error('Erro ao buscar turno atual:', err);
    res.status(500).json({ message: 'Erro interno ao buscar turno.' });
  }
});





app.put('/pedido/:id/turno', async (req, res) => {
  try {
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { turno: req.body.turno },
      { new: true }
    );
    res.json(pedidoAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar turno do pedido:', err);
    res.status(500).json({ message: 'Erro ao atualizar turno do pedido.' });
  }
});

app.put('/pedido/:id/distancia', async (req, res) => {
  try {
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { distancia: req.body.distancia },
      { new: true }
    );
    res.json(pedidoAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar turno do pedido:', err);
    res.status(500).json({ message: 'Erro ao atualizar turno do pedido.' });
  }
});

app.put('/pedido/:id/distancia-destino', async (req, res) => {
  try {
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { distanciaDestino: req.body.distanciaDestino },
      { new: true }
    );
    res.json(pedidoAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar turno do pedido:', err);
    res.status(500).json({ message: 'Erro ao atualizar turno do pedido.' });
  }
});

// GET /viagens — retorna todas as viagens
app.get('/viagens', async (req, res) => {
  try {
    const viagens = await Viagem.find()
      .populate({
        path: 'pedido',
        populate: [
          {
            path: 'turno',
            populate: [
              { path: 'taxi' },
              { path: 'motorista' }
            ]
          },
          { path: 'cliente' } 
        ]
      })
      .populate('moradaInicio')
      .populate('moradaFim')
      .populate('periodo');

    res.json(viagens);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter viagens.' });
  }
});

// No backend (app.js ou arquivo de rotas)
app.get('/viagens/:id', async (req, res) => {
  const viagemId = req.params.id;  // Pega o ID da viagem da URL
  try {
    const viagem = await Viagem.findById(viagemId)
      .populate({
        path: 'pedido',
        populate: [
          {
            path: 'turno',
            populate: [
              { path: 'taxi' },
              { path: 'motorista' }
            ]
          },
          { path: 'cliente' } 
        ]
      })
      .populate('moradaInicio')
      .populate('moradaFim')
      .populate('periodo');

    if (!viagem) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }

    res.json(viagem);  // Retorna a viagem encontrada
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter viagem.' });
  }
});



// POST /viagem — adiciona uma nova viagem
app.post('/viagem', async (req, res) => {
  try {
    // Tenta salvar a nova viagem
    const novaViagem = new Viagem(req.body);
    const viagemSalva = await novaViagem.save();
    res.json(viagemSalva);
  } catch (err) {
    // Registra o erro completo no console para depuração
    console.error('Erro ao salvar a viagem:', err);

    // Envia uma resposta com um status 400 e uma mensagem de erro
    res.status(400).json({ message: 'Erro ao salvar viagem.', error: err.message });
  }
});

// Atualiza custo da viagem
app.patch('/viagens/:id/custo', async (req, res) => {
  try {
    const { custo } = req.body;
    const viagemAtualizada = await Viagem.findByIdAndUpdate(
      req.params.id,
      { custo },
      { new: true }
    );
    if (!viagemAtualizada) {
      return res.status(404).json({ message: 'Viagem não encontrada.' });
    }
    res.json(viagemAtualizada);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o custo da viagem.' });
  }
});



// obter total de viagens num turno
app.get('/viagens/turno/:turnoId/total-viagens', async (req, res) => {
  try {
    const turnoId = req.params.turnoId;

    const viagens = await Viagem.find()
    .populate({
      path: 'pedido',
      select: 'turno',
    });
    
    // Filtra as viagens cujo pedido.tem turno === turnoId
    const totalViagens = viagens.filter(v => 
      v.pedido?.turno?.toString() === turnoId
    ).length;
    
    res.json(totalViagens);
  } catch (err) {
    console.error('Erro ao contar viagens do turno:', err);
    res.status(500).json({ message: 'Erro ao contar viagens do turno.' });
  }
});

// GET /viagens/motorista/:motoristaId — retorna todas as viagens de um motorista
app.get('/viagens/motorista/:motoristaId', async (req, res) => {
  const motoristaId = req.params.motoristaId;

  try {
    const viagens = await Viagem.find()
      .populate({
        path: 'pedido',
        match: { motoristaQueAceitou: motoristaId },
         populate: [
          { path: 'cliente' },
          {
            path: 'turno',
            populate: { path: 'taxi' }
          }
        ]
      })
      .populate('moradaInicio')
      .populate('moradaFim')
      .populate('periodo');

    // Filtrar e ordenar por data de início (mais recente primeiro)
    const viagensDoMotorista = viagens
      .filter(v => v.pedido !== null)
      .sort((a, b) => {
        const dataA = new Date(a.periodo.inicio).getTime();
        const dataB = new Date(b.periodo.inicio).getTime();
        return dataB - dataA; // Mais recente primeiro
      });

    res.json(viagensDoMotorista);
  } catch (err) {
    console.error('Erro ao obter viagens do motorista:', err);
    res.status(500).json({ message: 'Erro ao obter viagens do motorista.' });
  }
});

app.get('/clientes/nif/:nif', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ NIF: req.params.nif });
    if (!cliente) return res.status(404).send({ message: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar cliente por NIF' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});
