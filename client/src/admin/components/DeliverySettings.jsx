import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import '../styles/profile.css'; // Reuse profile styles for consistent look
import AdminDeleteButton from './AdminDeleteButton';

const DeliverySettings = () => {
    const rules = useQuery(api.modules.settings.deliveryCharges.getAllDeliveryChargeRules) || [];
    const createRule = useMutation(api.modules.settings.deliveryCharges.createDeliveryChargeRule);
    const deleteRule = useMutation(api.modules.settings.deliveryCharges.deleteDeliveryChargeRule);

    const [newRule, setNewRule] = useState({ minOrderAmount: '', deliveryFee: '' });
    const [error, setError] = useState('');

    const handleAddRule = async (e) => {
        e.preventDefault();
        setError('');

        const minOrder = parseFloat(newRule.minOrderAmount);
        const fee = parseFloat(newRule.deliveryFee);

        if (isNaN(minOrder) || isNaN(fee)) {
            setError('Please enter valid numbers');
            return;
        }

        if (minOrder < 0 || fee < 0) {
            setError('Values cannot be negative');
            return;
        }

        try {
            await createRule({
                minOrderAmount: minOrder,
                deliveryFee: fee,
                isActive: true
            });
            setNewRule({ minOrderAmount: '', deliveryFee: '' });
        } catch (err) {
            setError(err.message.includes('already exists')
                ? 'A rule for this order amount already exists'
                : 'Failed to add rule');
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            try {
                await deleteRule({ ruleId: id });
            } catch (err) {
                console.error("Failed to delete rule:", err);
                alert("Failed to delete rule");
            }
        }
    };

    return (
        <div className="profile-card">
            <div className="profile-header">
                <h3>🚚 Delivery Charges</h3>
                <p>Set delivery fees based on order value ranges.</p>
            </div>

            <div className="delivery-settings-content">
                <form onSubmit={handleAddRule} className="add-rule-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Min Order (₹)</label>
                            <input
                                type="number"
                                value={newRule.minOrderAmount}
                                onChange={(e) => setNewRule({ ...newRule, minOrderAmount: e.target.value })}
                                placeholder="e.g. 0"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Delivery Fee (₹)</label>
                            <input
                                type="number"
                                value={newRule.deliveryFee}
                                onChange={(e) => setNewRule({ ...newRule, deliveryFee: e.target.value })}
                                placeholder="e.g. 50"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary add-btn">
                            Add Rule
                        </button>
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                </form>

                <div className="rules-list">
                    <h4>Active Rules</h4>
                    {rules.length === 0 ? (
                        <p className="no-data">No delivery rules defined. Delivery will be free.</p>
                    ) : (
                        <div className="rules-table-container">
                            <table className="rules-table">
                                <thead>
                                    <tr>
                                        <th>Order Value</th>
                                        <th>Delivery Fee</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rules.map((rule) => (
                                        <tr key={rule._id}>
                                            <td>≥ ₹{rule.minOrderAmount}</td>
                                            <td>
                                                {rule.deliveryFee === 0 ? (
                                                    <span className="free-tag">FREE</span>
                                                ) : (
                                                    `₹${rule.deliveryFee}`
                                                )}
                                            </td>
                                            <td>
                                                <AdminDeleteButton
                                                    onClick={() => handleDeleteRule(rule._id)}
                                                    title="Remove Rule"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .delivery-settings-content {
                    padding: 20px;
                }
                .add-rule-form {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }
                .form-row {
                    display: flex;
                    gap: 16px;
                    align-items: flex-end;
                }
                .form-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #555;
                }
                .form-group input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                }
                .add-btn {
                    height: 42px;
                    padding: 0 24px;
                    white-space: nowrap;
                }
                .error-msg {
                    color: #dc3545;
                    font-size: 0.9rem;
                    margin-top: 10px;
                }
                .rules-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .rules-table th {
                    text-align: left;
                    padding: 12px;
                    background: #f1f3f5;
                    color: #495057;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .rules-table td {
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                    color: #333;
                }
                .free-tag {
                    background: #d4edda;
                    color: #155724;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .delete-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .delete-btn:hover {
                    opacity: 1;
                }
                .no-data {
                    text-align: center;
                    color: #6c757d;
                    padding: 20px;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default DeliverySettings;
