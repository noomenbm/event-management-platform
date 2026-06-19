import { useId, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUpdateUserMutation, useUserQuery } from '../queries/users';

export const ProfilePage = () => {
  const formId = useId();
  const { currentUser, updateCurrentUser } = useAuth();
  const { theme, setThemePreference } = useTheme();
  const { showToast } = useOutletContext();
  const userId = currentUser.id;
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useUserQuery(userId);
  const updateUserMutation = useUpdateUserMutation({ userId, updateCurrentUser });
  const profileUser = user || currentUser;
  const [themePreferenceDraft, setThemePreferenceDraft] = useState('');
  const themePreference = themePreferenceDraft || profileUser.preferences?.theme || theme;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedUser = await updateUserMutation.mutateAsync({
        preferences: {
          ...profileUser.preferences,
          theme: themePreference,
        },
      });

      setThemePreference(updatedUser.preferences?.theme || themePreference);
      setThemePreferenceDraft('');
      showToast('Profile preferences updated.');
    } catch {
      showToast('Unable to update profile preferences.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="page-hero">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Loading your preferences...</p>
        </div>
        <div className="profile-panel">
          <div className="skeleton skeleton-line title"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line short"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <div className="error-state-title">Profile Failed</div>
          <p>{error.message || 'Something went wrong while loading your profile.'}</p>
          <button className="retry-button" type="button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-hero">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">View your account and adjust saved preferences.</p>
      </div>

      <section className="profile-layout" aria-labelledby="profile-summary-title">
        <article className="profile-panel">
          <h2 id="profile-summary-title">Account</h2>
          <dl className="profile-list">
            <div>
              <dt>Name</dt>
              <dd>{profileUser.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profileUser.email}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{profileUser.id}</dd>
            </div>
            <div>
              <dt>Favorite Events</dt>
              <dd>{profileUser.favoriteEvents?.length || 0}</dd>
            </div>
          </dl>
        </article>

        <form className="profile-panel" onSubmit={handleSubmit}>
          <h2>Preferences</h2>
          <label className="profile-field" htmlFor={`${formId}-theme`}>
            Theme
            <select
              id={`${formId}-theme`}
              className="filter-select"
              value={themePreference}
              onChange={(event) => setThemePreferenceDraft(event.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <p className="profile-current-theme">
            Current app theme: {theme}
          </p>

          <button
            className="primary-button"
            type="submit"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </section>
    </div>
  );
};
