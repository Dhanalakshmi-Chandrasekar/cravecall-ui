import { Bell, Lock, User, Building, CreditCard, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, updateSettings, SettingsDTO , uploadBrandLogo} from "../api/settings";
import { getMe, updateMe } from "../api/users";


export default function Settings() {
  const [loading, setLoading] = useState(true);

  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [data, setData] = useState<SettingsDTO | null>(null);

  // ✅ Branding (white-label)
  const [appName, setAppName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Local restaurant form state
  const [restaurantName, setRestaurantName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [notifEmailNewOrders, setNotifEmailNewOrders] = useState(true);
  const [notifSmsUrgent, setNotifSmsUrgent] = useState(true);
  const [notifWeeklyReports, setNotifWeeklyReports] = useState(false);
  const [notifCustomerFeedback, setNotifCustomerFeedback] = useState(true);

  // Account (real)
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, me] = await Promise.all([getSettings(), getMe()]);
        setData(s);

        // ✅ Branding defaults
        const branding = (s as any)?.branding || {};
        setAppName(branding.app_name || s.restaurant_name || "Savory Bites");
        setTagline(branding.tagline || "Catering Manager");
        setLogoUrl(branding.logo_url || "");

        setRestaurantName(s.restaurant_name || "");
        setBusinessPhone(s.business_phone || "");
        setBusinessEmail(s.business_email || "");
        setBusinessAddress(s.business_address || "");

        setNotifEmailNewOrders(!!s.notifications?.email_new_orders);
        setNotifSmsUrgent(!!s.notifications?.sms_urgent_orders);
        setNotifWeeklyReports(!!s.notifications?.weekly_revenue_reports);
        setNotifCustomerFeedback(!!s.notifications?.customer_feedback);

        setYourName(me.name || "");
        setYourEmail(me.email || "");
      } catch (e: any) {
        alert(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refreshSettings() {
    const s = await getSettings();
    setData(s);
    const branding = (s as any)?.branding || {};
    setAppName(branding.app_name || s.restaurant_name || "Savory Bites");
    setTagline(branding.tagline || "Catering Manager");
    setLogoUrl(branding.logo_url || "");
  }

  async function handleSaveRestaurantSettings() {
    setSavingRestaurant(true);
    try {
      await updateSettings({
        restaurant_name: restaurantName,
        business_phone: businessPhone,
        business_email: businessEmail,
        business_address: businessAddress,
        notifications: {
          email_new_orders: notifEmailNewOrders,
          sms_urgent_orders: notifSmsUrgent,
          weekly_revenue_reports: notifWeeklyReports,
          customer_feedback: notifCustomerFeedback,
        },
      });

      await refreshSettings();
      alert("Saved ✅");
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSavingRestaurant(false);
    }
  }

  // ✅ Save only branding (app_name + tagline + logo_url stored)
  async function handleSaveBranding() {
    setSavingBranding(true);
    try {
      await updateSettings({
        branding: {
          app_name: appName,
          tagline,
          logo_url: logoUrl,
        } as any,
      });

      await refreshSettings();
      alert("Branding saved ✅");
    } catch (e: any) {
      alert(e?.message || "Branding save failed");
    } finally {
      setSavingBranding(false);
    }
  }

async function handleLogoUpload(file: File) {
  setUploadingLogo(true);
  try {
    const { logo_url } = await uploadBrandLogo(file);

    // preview immediately
    setLogoUrl(logo_url);

    // save branding with new url
    await updateSettings({
      branding: {
        app_name: appName,
        tagline,
        logo_url,
      } as any,
    });

    await refreshSettings();
    alert("Logo uploaded ✅");
  } catch (e: any) {
    alert(e?.message || "Upload failed");
  } finally {
    setUploadingLogo(false);
  }
}


  async function handleUpdateAccount() {
    setSavingAccount(true);
    try {
      await updateMe({ name: yourName, email: yourEmail });
      alert("Account updated ✅");
    } catch (e: any) {
      alert(e?.message || "Account update failed");
    } finally {
      setSavingAccount(false);
    }
  }

  if (loading) return <div className="p-8">Loading settings…</div>;

  const billing = data?.billing;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your restaurant and account settings</p>
      </div>

      {/* ✅ BRANDING (White-label) */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-50 p-3 rounded-lg">
            <Palette className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Branding</h2>
            <p className="text-sm text-gray-600">
              This controls the sidebar logo + name (white-label)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Savory Bites"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Catering Manager"
            />
          </div>

          {/* ✅ Logo upload instead of URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Upload (optional)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogoUpload(f);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">PNG/JPG/WebP/SVG. Recommended 256×256.</p>
            {uploadingLogo && <p className="text-xs text-purple-600 mt-2">Uploading...</p>}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleSaveBranding}
            disabled={savingBranding}
            className="bg-purple-600 text-white font-medium px-5 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {savingBranding ? "Saving..." : "Save Branding"}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">No logo</span>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{appName || "App Name"}</div>
              <div className="text-xs text-gray-500">{tagline || "Tagline"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing UI below remains same */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Restaurant Information</h2>
              <p className="text-sm text-gray-600">Update your business details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone
              </label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSaveRestaurantSettings}
              disabled={savingRestaurant}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-60"
            >
              {savingRestaurant ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Account + Notifications */}
        <div className="space-y-6">
          {/* Account */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-600">Manage your account preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={yourEmail}
                  onChange={(e) => setYourEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                onClick={handleUpdateAccount}
                disabled={savingAccount}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {savingAccount ? "Updating..." : "Update Account"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-50 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Configure notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifEmailNewOrders}
                  onChange={(e) => setNotifEmailNewOrders(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Email notifications for new orders</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifSmsUrgent}
                  onChange={(e) => setNotifSmsUrgent(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">SMS alerts for urgent orders</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifWeeklyReports}
                  onChange={(e) => setNotifWeeklyReports(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Weekly revenue reports</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifCustomerFeedback}
                  onChange={(e) => setNotifCustomerFeedback(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Customer feedback notifications</span>
              </label>

              <button
                onClick={handleSaveRestaurantSettings}
                disabled={savingRestaurant}
                className="mt-2 w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                {savingRestaurant ? "Saving..." : "Save Notification Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security + Billing */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-50 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Update your password</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <button
              onClick={() => alert("Connect this to /users/change-password later")}
              className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-50 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Billing</h2>
              <p className="text-sm text-gray-600">Manage payment methods</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {billing?.plan_name ?? "Premium Plan"}
                </span>
                <span className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full">
                  {(billing?.status ?? "active").toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Unlimited orders and advanced features</p>
              <div className="text-2xl font-bold text-gray-900">
                ${Number(billing?.price_monthly ?? 99)}/month
              </div>
            </div>

            <button
              onClick={() => alert("Connect this to Stripe later")}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
