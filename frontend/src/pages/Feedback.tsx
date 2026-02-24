import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubmitFeedback } from '../hooks/useFeedback';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { identity } = useInternetIdentity();
  const submitFeedback = useSubmitFeedback();

  const isAuthenticated = !!identity;

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setErrorMsg('');

    try {
      await submitFeedback.mutateAsync({ category, message: message.trim() });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <div className="bg-carbon-black border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Feedback</h1>
              <p className="text-muted-foreground mt-1">
                Share your feedback and suggestions with the BAJA team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground max-w-sm">
              Your feedback has been received. The BAJA team appreciates your input and will review it shortly.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                setCategory('general');
                setErrorMsg('');
              }}
              variant="outline"
              className="mt-6 border-primary/40 text-primary hover:bg-primary/10"
            >
              Submit Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login notice */}
            {!isAuthenticated && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  You must be logged in to submit feedback.
                </p>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150
                      ${category === cat.value
                        ? 'bg-primary/15 border-primary text-primary'
                        : 'bg-carbon-black/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={6}
                required
                className="
                  w-full px-4 py-3 rounded-xl border border-border/60 bg-carbon-black/50
                  text-foreground placeholder:text-muted-foreground/60
                  focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60
                  resize-none transition-all duration-150
                  text-sm
                "
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{errorMsg}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!message.trim() || submitFeedback.isPending || !isAuthenticated}
              className="w-full flex items-center justify-center gap-2 py-3 font-semibold"
            >
              {submitFeedback.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Feedback
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
