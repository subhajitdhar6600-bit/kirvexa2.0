const BASE_URL = 'http://localhost:5000/api';

async function testAllFrontendApis() {
  console.log('=======================================================');
  console.log('ð Testing All Frontend API Integrations...');
  console.log('=======================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  â ${message}`);
      passed++;
    } else {
      console.error(`  â ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(health.isConnected === true, 'api.checkHealth() -> connected to Farma database');

    // 2. Seed
    const seedRes = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
    assert(seedRes.status === 200, 'api.seedDatabase() -> success');

    // 3. Users
    const usersRes = await fetch(`${BASE_URL}/users`);
    const users = await usersRes.json();
    assert(Array.isArray(users), 'api.getUsers() -> returns array');

    const saveUserRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `test-usr-${Date.now()}`,
        name: 'Test UI Farmer',
        phone: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'farmer',
        district: 'Patna',
      }),
    });
    assert(saveUserRes.status === 200, 'api.saveUser() -> success');

    // 4. KCC
    const kccRes = await fetch(`${BASE_URL}/kcc`);
    const kccApps = await kccRes.json();
    assert(Array.isArray(kccApps), 'api.getKccApplications() -> returns array');

    const testKccId = `kcc-test-${Date.now()}`;
    const submitKccRes = await fetch(`${BASE_URL}/kcc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testKccId,
        fullName: 'Test KCC User',
        phone: '9876543210',
        aadhaar: '123456789012',
        district: 'Gaya',
        status: 'pending',
      }),
    });
    assert(submitKccRes.status === 200, 'api.submitKccApplication() -> success');

    const approveKccRes = await fetch(`${BASE_URL}/kcc/${testKccId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardNumber: 'KCC-BH-2026-9999' }),
    });
    assert(approveKccRes.status === 200, 'api.approveKccApplication() -> success');

    // 5. Crops
    const cropsRes = await fetch(`${BASE_URL}/crops`);
    const crops = await cropsRes.json();
    assert(Array.isArray(crops), 'api.getCrops() -> returns array');

    const testCropId = `crop-test-${Date.now()}`;
    const addCropRes = await fetch(`${BASE_URL}/crops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testCropId,
        sellerName: 'Ramesh Singh',
        phone: '9876543210',
        cropName: 'Golden Mustard',
        weight: '40 Quintal',
        price: 5400,
        district: 'Patna',
        status: 'pending',
      }),
    });
    assert(addCropRes.status === 200, 'api.addCrop() -> success');

    const approveCropRes = await fetch(`${BASE_URL}/crops/${testCropId}/approve`, { method: 'PUT' });
    assert(approveCropRes.status === 200, 'api.approveCrop() -> success');

    // 6. Labour
    const labourRes = await fetch(`${BASE_URL}/labour/bookings`);
    const labours = await labourRes.json();
    assert(Array.isArray(labours), 'api.getLabourBookings() -> returns array');

    const labourTypesRes = await fetch(`${BASE_URL}/labour/types`);
    const labourTypes = await labourTypesRes.json();
    assert(Array.isArray(labourTypes), 'api.getLabourTypes() -> returns array');

    // 7. Machinery
    const machineryRes = await fetch(`${BASE_URL}/machinery`);
    const machinery = await machineryRes.json();
    assert(Array.isArray(machinery), 'api.getMachineryBookings() -> returns array');

    // 8. Expert
    const expertRes = await fetch(`${BASE_URL}/expert`);
    const expert = await expertRes.json();
    assert(Array.isArray(expert), 'api.getExpertQueries() -> returns array');

    // 9. Mandi
    const mandiRes = await fetch(`${BASE_URL}/mandi`);
    const mandi = await mandiRes.json();
    assert(Array.isArray(mandi), 'api.getMandiRates() -> returns array');

    // 10. Dealer Listings
    const dealerListingsRes = await fetch(`${BASE_URL}/dealer/listings`);
    const dealerListings = await dealerListingsRes.json();
    assert(Array.isArray(dealerListings), 'api.getDealerListings() -> returns array');

    const testDealerId = `dl-test-${Date.now()}`;
    const addDealerRes = await fetch(`${BASE_URL}/dealer/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testDealerId,
        dealerId: 'dealer-01',
        dealerName: 'Kisan Agro',
        type: 'product',
        title: 'NPK Fertilizer',
        price: 450,
        status: 'pending',
      }),
    });
    assert(addDealerRes.status === 200, 'api.addDealerListing() -> success');

    const approveDealerRes = await fetch(`${BASE_URL}/dealer/listings/${testDealerId}/approve`, { method: 'PUT' });
    assert(approveDealerRes.status === 200, 'api.approveDealerListing() -> success');

    // 11. Farmers
    const farmersRes = await fetch(`${BASE_URL}/farmers`);
    const farmers = await farmersRes.json();
    assert(Array.isArray(farmers), 'api.getRegisteredFarmers() -> returns array');

    // 12. Orders
    const ordersRes = await fetch(`${BASE_URL}/orders`);
    const orders = await ordersRes.json();
    assert(Array.isArray(orders), 'api.getOrders() -> returns array');

    const testOrderId = `ORD-test-${Date.now()}`;
    const createOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testOrderId,
        userId: 'usr-101',
        userName: 'Suresh Kumar',
        totalAmount: 1450,
        paymentMethod: 'cod',
        deliveryAddress: 'Danapur, Patna',
        status: 'Confirmed',
      }),
    });
    assert(createOrderRes.status === 200, 'api.createOrder() -> success');

    const updateOrderRes = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Delivered' }),
    });
    assert(updateOrderRes.status === 200, 'api.updateOrderStatus() -> success');

    // 13. Pathshala
    const pathshalaRes = await fetch(`${BASE_URL}/pathshala`);
    const pathshala = await pathshalaRes.json();
    assert(Array.isArray(pathshala), 'api.getPathshalaVideos() -> returns array');

    // 14. Notifications
    const notifsRes = await fetch(`${BASE_URL}/notifications`);
    const notifs = await notifsRes.json();
    assert(notifs.notifications || Array.isArray(notifs), 'api.getNotifications() -> returns notifications');

    // 15. Cards
    const cardRes = await fetch(`${BASE_URL}/cards/KCC-BH-2026-1001`);
    assert(cardRes.status === 200, 'api.checkFarmerCardBalance() -> success');

    console.log('=======================================================');
    console.log(`ð¯ FRONTEND API TEST RUN: ${passed} passed, ${failed} failed`);
    console.log('=======================================================');

    if (failed > 0) process.exit(1);
    else process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

testAllFrontendApis();
