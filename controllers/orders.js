const db_orders = require('../model/orders');
const { providers } = require('../model/providers')
const { services } = require('../model/services')
var url = require('url');
const path = require('path');

exports.create_order = function(req, res) {
    let body = req.body
    db_orders.create_orders(body.customer, body.provider, body.execution_time).then(() => res.redirect(200, '/'))
}

exports.find_orders = async function(req, res) {
    db_orders.find_orders().then(async data => {
        if (req.session.executor) { // если вошли под исполниелем, формируем файл
            let text = ''
            for (order in data) {
                console.log(data)
                let provider = await providers.findOne({ Name: data[0].provider })
                console.log(provider)
                let service = await services.findOne({ Name: data[0].customer })
                text += `Информация о заказчике:\n
                 Наименование организации : ${provider.Name}\n 
                 Тип услуг : ${provider.Type},\n
                 УНП : ${provider.UNP},\n 
                 Юридический адрес : ${provider.Legal_address},\n 
                 Фактический адрес : ${provider.Actual_address},\n 
                 Телефон : ${provider.Tel},\n 
                 Контактное лицо : ${provider.Person}\n 
                 Банковский счет : ${provider.Payment}\n 
                 Рейтинг в системе : ${provider.Rating}\n 
                 Информация об выполняемой услуге : \n 
                 Наименование : ${service.Name},\n 
                 Код : ${service.Code},\n 
                 Единица измерения : ${service.Unit},\n 
                 Артикул : ${service.VendorCode},\n 
                 Страна происхождения : ${service.Country_of_origin}\n 
                 Вес : ${service.Weight},\n 
                 Является услугой : ${service.Service == true ? 'Да' : 'Нет'}\n 
                `
            }
            res.render('orders', { user: req.session.user, role: req.session.role, orders: data, customer: req.session.customer, executor: req.session.executor, text: text, admin: req.session.admin })
        } else if (req.session.customer) {
            res.render('orders', { user: req.session.user, role: req.session.role, orders: data, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin })
        }

    })
}

exports.order_setdone = function(req, res) {
    db_orders.find_order(req.body).then(data => res.redirect(200, '/'))
}

exports.download_orders = function(req, res) {
    res.send(Buffer.from(req.query.text))
}