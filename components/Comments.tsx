'use client';

import { useState } from 'react';

export function Comments() {
  const [sent, setSent] = useState(false);

  return (
    <div className="comments">
      <div className="comments-title">دیدگاهتان را بنویسید</div>
      <p className="comments-note">نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند *</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="comments-field">
          <textarea className="comments-textarea" name="comment" placeholder="* دیدگاه" required aria-label="دیدگاه" />
        </div>
        <div className="comments-field">
          <input className="comments-input" type="text" name="author" placeholder="* نام" required aria-label="نام" />
        </div>
        <div className="comments-field">
          <input className="comments-input" type="email" name="email" placeholder="* ایمیل" required aria-label="ایمیل" />
        </div>
        <div className="comments-checkbox-row">
          <input type="checkbox" id="comments-save" name="wp-comment-cookies-consent" />
          <label htmlFor="comments-save">ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاه می‌نویسم</label>
        </div>
        <button className="comments-submit" type="submit" disabled={sent}>
          {sent ? 'دیدگاه ثبت شد' : 'فرستادن دیدگاه'}
        </button>
      </form>
    </div>
  );
}
