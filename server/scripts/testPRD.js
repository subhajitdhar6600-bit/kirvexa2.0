import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=======================================================');
  console.log('🧪 Running Comprehensive PRD Backend Test Suite...');
  console.log('=======================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'Health endpoint responds with 200');

    // 2. Auth: Register fresh unverified farmer for isolated test run
    const testPhone = `96${Math.floor(10000000 + Math.random() * 90000000)}`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ajay Verma (Test Farmer)',
        phone: testPhone,
        password: 'Farmer@123',
        role: 'farmer',
        district: 'Gaya',
        state: 'Bihar',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.data.user.kccStatus === 'NOT_APPLIED', 'Unverified Farmer registered with KCC: NOT_APPLIED');
    const unverifiedToken = regData.data.tokens.accessToken;

    // 3. Rule 1 Check: Attempting to create crop listing without KCC approval MUST fail with KCC_REQUIRED
    const cropAttemptRes = await fetch(`${BASE_URL}/farmer/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${unverifiedToken}`,
      },
      body: JSON.stringify({
        cropName: 'Unauthorized Crop',
        quantity: 10,
        expectedPrice: 2000,
      }),
    });
    const cropAttemptData = await cropAttemptRes.json();
    assert(
      cropAttemptRes.status === 403 && cropAttemptData.code === 'KCC_REQUIRED',
      'Rule 1 Enforced: Unapproved Farmer cannot list crops (HTTP 403, code: KCC_REQUIRED)'
    );

    // 4. Submit KCC Application as unverified farmer
    const kccApplyRes = await fetch(`${BASE_URL}/farmer/kcc/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${unverifiedToken}`,
      },
      body: JSON.stringify({
        fullName: 'Ajay Verma',
        district: 'Gaya',
        aadhaarNumber: '123456789012',
        landDetails: { surveyNumber: 'SY-102', landSizeAcres: 4, village: 'Bodhgaya' },
      }),
    });
    const kccApplyData = await kccApplyRes.json();
    assert(kccApplyRes.status === 201 && kccApplyData.data.application.status === 'PENDING', 'Farmer can submit KCC application (status: PENDING)');
    const applicationId = kccApplyData.data.application.id;

    // 5. Rule 10 Check: Duplicate active KCC application should be rejected
    const dupKccRes = await fetch(`${BASE_URL}/farmer/kcc/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${unverifiedToken}`,
      },
      body: JSON.stringify({ fullName: 'Ajay Verma', district: 'Gaya' }),
    });
    const dupKccData = await dupKccRes.json();
    assert(
      dupKccRes.status === 400 && dupKccData.code === 'DUPLICATE_APPLICATION',
      'Rule 10 Enforced: Cannot submit duplicate active KCC application'
    );

    // 6. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9999999999', password: 'Admin@123' }),
    });
    const adminLogin = await adminLoginRes.json();
    assert(adminLogin.success === true && adminLogin.data.user.role === 'admin', 'Admin logs in successfully');
    const adminToken = adminLogin.data.tokens.accessToken;

    // 7. Admin Approves KCC Application
    const approveRes = await fetch(`${BASE_URL}/admin/kcc/${applicationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ adminRemarks: 'Documents verified and land survey confirmed.' }),
    });
    const approveData = await approveRes.json();
    assert(approveRes.status === 200 && approveData.data.application.status === 'APPROVED', 'Admin approves KCC application');

    // 8. Re-login to get updated APPROVED status token
    const refreshedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, password: 'Farmer@123' }),
    });
    const refreshedLogin = await refreshedLoginRes.json();
    const approvedFarmerToken = refreshedLogin.data.tokens.accessToken;
    assert(refreshedLogin.data.user.kccStatus === 'APPROVED', 'User KCC status is now APPROVED');

    // 9. Now farmer can successfully list crop!
    const createCropRes = await fetch(`${BASE_URL}/farmer/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedFarmerToken}`,
      },
      body: JSON.stringify({
        cropName: 'Organic Yellow Maize',
        cropVariety: 'Kisan Ganga',
        quantity: 50,
        unit: 'quintal',
        expectedPrice: 2150,
        qualityGrade: 'A',
      }),
    });
    const createCropData = await createCropRes.json();
    assert(createCropRes.status === 201 && createCropData.data.crop.status === 'ACTIVE', 'Approved Farmer can now list crop successfully');

    // 10. Public Marketplace: Browse products
    const productsRes = await fetch(`${BASE_URL}/products`);
    const productsData = await productsRes.json();
    assert(productsRes.status === 200 && productsData.data.products.length > 0, 'Public can browse active products');
    const sampleProduct = productsData.data.products[0];

    // 11. Cart Management: Add product to cart & check server calculation
    const addCartRes = await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedFarmerToken}`,
      },
      body: JSON.stringify({ productId: sampleProduct.id, quantity: 2 }),
    });
    assert(addCartRes.status === 200, 'Farmer can add product to cart');

    const getCartRes = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${approvedFarmerToken}` },
    });
    const cartData = await getCartRes.json();
    assert(
      getCartRes.status === 200 && cartData.data.totalAmount > 0 && cartData.data.subtotal > 0,
      'Rule 5 Enforced: Cart subtotals and tax are calculated authoritatively by backend'
    );

    // 12. Create Order & Validate Inventory Decrement
    const preStock = sampleProduct.stockQuantity;
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedFarmerToken}`,
      },
      body: JSON.stringify({
        items: [{ productId: sampleProduct.id, quantity: 2 }],
        shippingAddress: {
          fullName: 'Ajay Verma',
          phone: testPhone,
          addressLine: 'Bodhgaya Road',
          district: 'Gaya',
          state: 'Bihar',
        },
        paymentMethod: 'COD',
      }),
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201 && (orderData.order?.orderStatus === 'CONFIRMED' || orderData.data?.order?.orderStatus === 'CONFIRMED'), 'Order created and placed successfully');

    // Verify stock decremented
    const prdCheckRes = await fetch(`${BASE_URL}/products/${sampleProduct.id}`);
    const prdCheckData = await prdCheckRes.json();
    assert(
      prdCheckData.data.product.stockQuantity === preStock - 2,
      `Rule 4 Enforced: Inventory atomically decremented from ${preStock} to ${prdCheckData.data.product.stockQuantity}`
    );

    // 13. Admin Dashboard & Audit Logs Verification
    const dashboardRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dashboardData = await dashboardRes.json();
    assert(dashboardRes.status === 200 && dashboardData.data.total_orders > 0, 'Admin Dashboard reports active metrics');

    const auditRes = await fetch(`${BASE_URL}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const auditData = await auditRes.json();
    const hasKccApprovalLog = auditData.data.logs.some((l) => l.action === 'ADMIN_APPROVED_KCC');
    assert(hasKccApprovalLog, 'Rule 7 & Section 26 Enforced: Admin actions are recorded in AuditLog');

    console.log('=======================================================');
    console.log(`🎉 PRD TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
    console.log('=======================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
