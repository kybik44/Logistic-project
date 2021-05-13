var mongoose = require('mongoose');
var { providers } = require('./providers');
const ordersSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    execution_period: { // время выполнения(может быть пустым)
        type: Number,
        required: true
    },
    status: { // статус заказа(выполнен или нет)
        type: Boolean,
        required: true
    }
})

var Orders = mongoose.model('orders', ordersSchema);

exports.find_orders = function() {
    return new Promise(function(resolve, reject) { //
        Orders.find({}, function(err, orders) {
            if (err) { reject(err); } else {
                resolve(orders);
            }
        });
    });
}
exports.create_orders = function(customer, provider, execution_time) {
    let order = new Orders()
    order.customer = customer
    order.provider = provider
    order.execution_period = Number(execution_time)
    order.status = false // по умолчанию заказ не выполнен
    return new Promise(function(resolve, reject) {
        order.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(order); //null
            }
        });
    });
}

exports.find_order = async function(order) {
    return new Promise(async function(resolve, reject) {
        await Orders.findOneAndUpdate({
            'customer': order.customer,
            'provider': order.provider,
            'execution_period': order.execution_period
        }, { 'status': true })
        await providers.findOneAndUpdate({ 'Name': order.provider }, { $inc: { 'Rating': 1 } })
        resolve(order); //null
    });
}